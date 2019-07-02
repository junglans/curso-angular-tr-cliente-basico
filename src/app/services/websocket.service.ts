import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { TopicService } from './topic/topic.service';
import { v4 as uuid } from 'uuid';
import { User } from '../model/user';
import { Message } from './topic/message';
import { LISTEN_SERVER_STATUS_CHANGES, SEND_OUTGOING_MESSAGES, LISTEN_INCOMING_MESSAGES } from '../model/constants';
@Injectable({
  providedIn: 'root' // Esto significa que no debe declararse en el módulo
})
export class WebsocketService {

  private _connected: Boolean = false;S
  private senderId: string;
  private user: User;

  constructor(private socket: Socket, private topicService: TopicService) { 
      this.checkServerStatus();
      this.listenMessage();
      this.senderId = uuid();

      // Escuchamos eventos de mensajes salientes por si algun componente quiere enviar mensajes al servidor a través del socket.
      this.topicService.subscribe(SEND_OUTGOING_MESSAGES, (message: Message) => {
          // Sending the message to the server...
          this.sendMessage('messages', message);
      });
  }

  public checkServerStatus(): void {

      this.socket.on('connect', () => {
          console.log('WebsocketService> Conectado al servidor');
          this._connected = true;
          this.topicService.publish(LISTEN_SERVER_STATUS_CHANGES, new Message(this.senderId, this._connected));
      });

      this.socket.on('disconnect', () => {
        console.log('WebsocketService> Desconectado del servidor');
        this._connected = false;
        this.topicService.publish(LISTEN_SERVER_STATUS_CHANGES, new Message(this.senderId, this._connected));
      });

  }

  private sendMessage(eventName: string, message?: any, callback?: Function): void {
    console.log('WebsocketService.sendMessage> enviando mensaje eventName: ' + eventName + ' con payload :' + JSON.stringify(message));
    this.socket.emit(eventName, message, callback);
  }

  private listenMessage():void {
    // Cuando llega un mensaje entrante se publica en el tópico que escucha los mensajes entrantes.
    this.socket.on('messages', (message: {__senderId:string, _payload: any}) => {
        console.log('WebsocketService.listenMessage> recibiendo mensaje...' + JSON.stringify(message));
        this.topicService.publish(LISTEN_INCOMING_MESSAGES, new Message(message.__senderId, message._payload));
    });
  }

  public get connected() {
    return this._connected;
  }

  public login(username: string): void {
    this.sendMessage('configure-user', { username }, (resp) => {
        console.log(resp);
    });
  }
}
