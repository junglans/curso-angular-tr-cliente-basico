import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private wsService: WebsocketService) { }

  public sendMessage(message: string): void {
    this.wsService.sendMessage('messages', {from: 'Juan F. Jiménez Pérez', body: message});
  }

}
