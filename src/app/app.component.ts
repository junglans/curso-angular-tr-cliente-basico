import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { Subscription } from 'rxjs';
import { TopicService } from './services/topic/topic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  
 
  
  title = 'cliente-basico';
  private _subscription: Subscription;
  constructor( private wsService: WebsocketService, private topicService: TopicService) {}

  ngOnInit(): void {
  
      this.topicService.createTopic('SERVER_STATUS');
      this.topicService.createTopic('MESSAGE_IN');
      this.topicService.createTopic('MESSAGE_OUT');
      
  }

  ngOnDestroy(): void {
    this.topicService.clearAll();
  }
}
