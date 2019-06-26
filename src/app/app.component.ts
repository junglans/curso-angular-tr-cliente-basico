import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { ChatService } from './services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  
  title = 'cliente-basico';
  private _subscription: Subscription;
  constructor( private wsService: WebsocketService, private chatService: ChatService) {}

  ngOnInit(): void { 
    this._subscription = this.wsService.subject.subscribe((connected : Boolean) =>{ 
      console.log(`AppComponent> Recibido evento de conexión/deconexión del servidor. Conectado :${connected}`) 
      if (connected) {
         console.log('AppComponent> Enviando mensaje...');
         this.chatService.sendMessage('¡¡Hola Mundo!!');
      }
   });
   
  }
}
