import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(public wsService: WebsocketService, private router: Router) {}
  ngOnInit() {}

  public logout(): void {
    console.log('MessagesComponent.logout> Invocando logout.');
    this.wsService.logout()
    .then(() => {
        this.router.navigateByUrl('/');
    })
    .catch(() => {
      console.log('Se ha producido un error.');
    });
  }

}
