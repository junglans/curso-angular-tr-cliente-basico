import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { TopicService } from 'src/app/services/topic/topic.service';
import { LISTEN_USER_STATUS_CHANGES, REQUEST_USERS_CONNECTED } from 'src/app/model/constants';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/services/topic/message';
import { User } from 'src/app/model/user';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit, OnDestroy, AfterViewInit {
  
  
  private subscription: Subscription;
  private users: User[] = [];

  constructor(private topicService: TopicService, private wsService: WebsocketService) { }

  ngOnInit() {
   this.subscription =  this.topicService.subscribe(LISTEN_USER_STATUS_CHANGES, (message: Message) => {
    // console.log('UserlistComponent> Recibido evento de cambios en usuarios: ' + JSON.stringify(message));
     this.users = [];
     message.payload.filter( ( item: any) => { return item.id !== this.wsService.user.id }).forEach( (element: any) => {
      this.users.push(new User(element.username, element.room, element.id));
     });
   });
  }

  ngAfterViewInit(): void {
    // Una vez que el componente se ha iniciado. Solicitamos la lista de usuarios conectados publicando la solicitud en un
    // tópico.
    console.log('UserlistComponent.ngAfterViewInit> Solicitando la lista de usuarios...');
    this.topicService.publish(REQUEST_USERS_CONNECTED, null);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
