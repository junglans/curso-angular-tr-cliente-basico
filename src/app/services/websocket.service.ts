import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { TopicService } from './topic/topic.service';

import { User } from '../model/user';
import { Message } from './topic/message';
import { LISTEN_SERVER_STATUS_CHANGES, SEND_OUTGOING_MESSAGES, LISTEN_INCOMING_MESSAGES, LISTEN_USER_STATUS_CHANGES, REQUEST_USERS_CONNECTED } from '../model/constants';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root' // Esto significa que no debe declararse en el módulo
})
/**
 * Este servicio es la pasarela que envía los mensajes de los componentes a través del socket y envía los mensajes entrantes recibidos
 * del socket a los componentes. Cuando un componente quiere enviar un mensajes lo publica en el topico SEND_OUTGOING_MESSAGES.
 *  Este servicio escucha mensajes en ese topico. Cuando recibe un mensaje lo envía a través del WebSocket.
 * Cuando se reciben mensajes de otra aplicación, éstos entran a través del socket que los publica en el
 * tópico LISTEN_INCOMING_MESSAGES que los hace llegar a cualquier componente que se haya suscrito.
 */
export class WebsocketService {

  private _connected: boolean = false;
  private _user: User = new User('no-name', 'no-room', 'no-id');

  constructor(private socket: Socket, 
              private topicService: TopicService,
              private router: Router) {

      // Registramos los listeners para los diferente eventos que envía el servidor.
      this.listenForUserId();
      this.checkServerStatus();
      this.listenPublicMessages();
      this.listenPrivateMessages();
      this.listenForUsers();
      this.listenForActiveUsers();
      
      this.getUserFromSessionStorage();

      // Escuchamos eventos de mensajes salientes por si algun componente quiere enviar mensajes al servidor a través del socket.
      this.topicService.subscribe(SEND_OUTGOING_MESSAGES, (message: Message) => {
          // Sending the message to the server...
          this.sendMessage('public-messages', message);
      });

      // Escuchamos solicitudes de realizadas desde los componentes para recuperar la lista de usuarios conetados..
      this.topicService.subscribe(REQUEST_USERS_CONNECTED, () => {
          // Enviamos la solicitud al servidor.
          this.sendMessage('active-users-request', null, (message: {ok: boolean, msg: any}) => {
              console.log(message)
          });
     });
  }

  public checkServerStatus(): void {
      // Los tópicos 'connect' y 'disconect' los envía el servidor.
      this.socket.on('connect', () => {

          //console.log('WebsocketService> Conectado al servidor ');
          this._connected = true;
          // Mandamos el usuario de nuevo al servidor si ya existía una sesión previamente.
          if (this._user != null) {
              this.getUserFromSessionStorage();
              this.relogin().then( ( data ) => { console.log('WebsocketService.checkServerStatus> Resolve :' + data); }
              ).catch( ( err ) => {
                  this.router.navigateByUrl('/');
                }
              );
          } 
          this.topicService.publish(LISTEN_SERVER_STATUS_CHANGES, new Message('server', this._connected));
      });

      this.socket.on('disconnect', () => {
        // console.log('WebsocketService> Desconectado del servidor');
        this._connected = false;
        this.topicService.publish(LISTEN_SERVER_STATUS_CHANGES, new Message('server', this._connected));
      });

  }

  /**
   * Este método envía el mensaje al servidor a través de socket.
   * @param eventName Nombre del evento
   * @param message El mensaje que se quiere enviar
   * @param callback función de callback que se ejecutará
   */
  private sendMessage(eventName: string, message?: any, callback?: (resp: any) => void): void {
    // console.log('WebsocketService.sendMessage> enviando mensaje eventName: ' + eventName + ' con payload :' + JSON.stringify(message));
    this.socket.emit(eventName, message, callback);
  }

  /**
   * Escucha mensajes públicos entrantes desde el socket y los publica en el tópico de los mensajes entrantes.
   */
  private listenPublicMessages(): void {
    // Cuando llega un mensaje entrante desde el servidor se publica en el tópico que escucha los mensajes entrantes.
    // Los mensajes pueden ser privados, dirigidos solamente a un cliente, o públicos dirigidos a todos.
    this.socket.on('public-messages', (message: {from: string, payload: any}) => {
        // console.log('WebsocketService.listenPublicMessages> recibiendo mensaje público...' + JSON.stringify(message));
        this.topicService.publish(LISTEN_INCOMING_MESSAGES, new Message( message.from, message.payload));
    });
  }
  /**
   * Escucha mensajes privados. Los mensajes privados se dirigen hacia un único cliente y se publican en el mismo tópico
   * de mensajes entrantes.
   */
  private listenPrivateMessages(): void {
    this.socket.on('private-messages', (message: {from: string, payload: any}) => {
      // console.log('WebsocketService.listenPrivateMessages> recibiendo mensaje privado...' + JSON.stringify(message));
      this.topicService.publish(LISTEN_INCOMING_MESSAGES, new Message( message.from, message.payload ));
    });
  }

  /**
   * Escucha por mensajes entrantes de cambios en la lista de usuarios conectados.
   */
  private listenForUsers(): void {

      this.socket.on('user-connection', (message: {from: string, payload: any}) => {
       // console.log('WebsocketService.listenForUsers> recibiendo mensaje de usuario conectado/desconectado: ' + JSON.stringify(message));
        this.topicService.publish(LISTEN_USER_STATUS_CHANGES, new Message( message.from, message.payload ));
      });

  }

  private listenForUserId(): void {

    this.socket.on('user-id', (message: {from: string, payload: string}) => {
      console.log('WebsocketService.listenForUsers> recibiendo mensaje de usuario conectado/desconectado: ' + JSON.stringify(message));
      this._user =  new User('no-name', 'no-room', message.payload);
    });

  }

  private listenForActiveUsers(): void {

      this.socket.on('active-users-request', (message: {from: string, payload: any}) => {
        console.log('WebsocketService.listenForActiveUsers> recibiendo listado de usuarios activos : ' + JSON.stringify(message));
           this.topicService.publish(LISTEN_USER_STATUS_CHANGES, new Message(message.from ,message.payload));

      });
  }

  public get connected(): boolean {
    return this._connected;
  }

  public get user(): User {
    return this._user;
  }

  public login(username: string): Promise<any> {

    return new Promise( (resolve, reject) => {
            this.sendMessage('configure-user', { username }, (resp: { ok: boolean, msg: string }) => {
                if (resp.ok) {
                  this._user.username = username;
                  this.saveToUserSessionStorage();
                  resolve('Login Ok');
                } else {
                  reject('Login Failed');
                }
            });
    });
  }

  private relogin()  {

    return new Promise( (resolve, reject) => {
      
      this.sendMessage('configure-user', { username: this._user.username }, (resp: {ok: boolean, msg: string}) => {
          if (resp.ok) {
            resolve('ReLogin Ok');
          } else {
            reject('ReLogin Failed');
          }
        }
      );

    });

  }

  private saveToUserSessionStorage(): void {
      sessionStorage.setItem('user', JSON.stringify( {username: this.user.username}));
  }

  private getUserFromSessionStorage(): void {
      const user: any | undefined = JSON.parse(sessionStorage.getItem('user'));
      if (user != null) {
        this._user.username = user.username;
        // In case of a page reloading the server is losing the username, we have to send it again.
        this.login(this._user.username);
      } else {
        this._user = null;
      }
  }
}
