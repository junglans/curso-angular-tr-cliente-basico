import { Component, OnInit, OnDestroy, ViewChild, ElementRef, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { TopicService } from 'src/app/services/topic/topic.service';
import { Message } from 'src/app/services/topic/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
 
  
  private chatElement: HTMLElement;

  private _connected: Boolean = false;
  private _subscriptionConnection: Subscription;
  private _subscriptionMsgIn: Subscription;

  public text: string = '';
  // List of received messages
  public messages: Array<any> = new Array<any>();

  constructor(private topicService: TopicService) {}

  ngOnInit() { 

    this._subscriptionConnection = this.topicService.subscribe('SERVER_STATUS', (connected : Boolean) =>{ 
      console.log(`ChatComponent> Recibido evento de conexión/deconexión del servidor. Conectado :${connected}`)
      this._connected = connected
    });

    this._subscriptionMsgIn = this.topicService.subscribe('MESSAGE_IN', (message : Message) =>{ 
      console.log('ChatComponent> Recibido mensaje entrante :' + JSON.stringify(message));
      console.log('ChatComponent> Recibido mensaje entrante :' + message.payload);
      this.messages.push(message.payload);
      this.scrollToBottom(); 
    });
  }

  ngOnDestroy(): void {

    if (this._subscriptionConnection) {
      this.topicService.unsubscribe(this._subscriptionConnection);
    }
    if (this._subscriptionMsgIn) {
      this.topicService.unsubscribe(this._subscriptionMsgIn);
    }
    
  }
 

  public sendMessage(): void {
    
    if (this.text.trim().length != 0) {
      
      console.log('ChatComponent.sendMessage> Sending message:' + JSON.stringify(this.text));
      this.topicService.publish('MESSAGE_OUT', new Message(this.topicService.senderId, this.text));
      this.text = '';

    }
  }

  ngAfterViewInit() {
    this.chatElement  = document.getElementById('chat-messages');
  }

  private scrollToBottom(): any { 
    setTimeout(()=>{
      this.chatElement.scrollTop =  this.chatElement.scrollHeight; 
    },50);      
     
  }
}
