import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { TopicService } from './topic/topic.service';
import { v4 as uuid } from 'uuid';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root' // Esto significa que no debe declararse en el módulo
})
export class WebsocketService {

  private _connected: Boolean = false;
  private senderId: string;
  private user: User;

  constructor(private socket: Socket, private topicService: TopicService) { 
      this.checkServerStatus();
      this.listenMessage();
      this.senderId = uuid();

      this.topicService.subscribe('MESSAGE_OUT', (message: any) => {
          // Sending the message to the server...
          this.sendMessage('messages', message);
      });
  }

  public checkServerStatus(): void {

      this.socket.on('connect', () => {
          console.log('WebsocketService> Conectado al servidor');
          this._connected = true;
          this.topicService.publish('SERVER_STATUS', this._connected, this.senderId);
      });

      this.socket.on('disconnect', () => {
        console.log('WebsocketService> Desconectado del servidor');
        this._connected = false;
        this.topicService.publish('SERVER_STATUS', this._connected, this.senderId);
      });

  }

  private sendMessage(eventName: string, payload?: any, callback?: Function): void {
    console.log('WebsocketService.sendMessage> enviando mensaje eventName: ' + eventName + ' con payload :' + JSON.stringify(payload));
    this.socket.emit(eventName, payload, callback);
  }

  private listenMessage():void {
    console.log('WebsocketService.listenMessage> recibiendo mensaje...');
    this.socket.on('messages', (message:any) => {
        this.topicService.publish('MESSAGE_IN', message);
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
