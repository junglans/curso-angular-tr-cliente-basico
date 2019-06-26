import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  title = 'cliente-basico';
  private _subscription: Subscription;
  constructor( private wsService: WebsocketService) {}

}
