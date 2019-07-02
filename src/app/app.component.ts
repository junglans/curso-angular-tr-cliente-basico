import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { Subscription } from 'rxjs';
import { TopicService } from './services/topic/topic.service';
import { LISTEN_INCOMING_MESSAGES, SEND_OUTGOING_MESSAGES, LISTEN_SERVER_STATUS_CHANGES } from './model/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  title = 'cliente-basico';
  // tslint:disable-next-line:no-inferrable-types
  active: boolean = false;
  constructor( private wsService: WebsocketService, private topicService: TopicService) {}

  ngOnInit(): void {
      this.topicService.createTopic(LISTEN_INCOMING_MESSAGES);
      this.topicService.createTopic(SEND_OUTGOING_MESSAGES);
      this.topicService.createTopic(LISTEN_SERVER_STATUS_CHANGES);
  }

  ngOnDestroy(): void {
    this.topicService.clearAll();
  }
}
