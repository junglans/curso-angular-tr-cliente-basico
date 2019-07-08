import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class UserlistComponent implements OnInit, OnDestroy {
  
  
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
   // Una vez cargado el componente y relizada la suscripción a cambios en los usuarios
   // solicitamos la lista de usuarios conectados.
   this.topicService.publish(REQUEST_USERS_CONNECTED, null);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
