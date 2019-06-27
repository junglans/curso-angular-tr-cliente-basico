import { Injectable } from '@angular/core';
import { TopicService } from './topic/topic.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private topicService: TopicService) { 

      this.topicService.subscribe('MESSAGE_IN', (message: any) => {

          console.log('ChatService> Received incoming message:' + JSON.stringify(message));

      });
  }

  public sendMessage(message: string): void {
      console.log('ChatService.sendMessage> Sending message:' + JSON.stringify(message));
      this.topicService.publish('MESSAGE_OUT', message);
  }
 
}
