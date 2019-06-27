import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription } from 'rxjs';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
 
  
  private _connected: Boolean = false;
  private _subscription: Subscription;

  public text: string = '';

  constructor(private topicService: TopicService, private chatService: ChatService) {}

  ngOnInit() { 
    this._subscription = this.topicService.subscribe('SERVER_STATUS', (connected : Boolean) =>{ 
      console.log(`ChatComponent> Recibido evento de conexión/deconexión del servidor. Conectado :${connected}`)
      this._connected = connected
    });
  }

  ngOnDestroy(): void {

    if (this._subscription) {
      this.topicService.unsubscribe(this._subscription);
    }
    
  }

  public sendMessage(): void {

    console.log('ChatComponent.sendMessage> ', this.text);
    this.chatService.sendMessage(this.text);
    this.text = '';
    
  }
}
