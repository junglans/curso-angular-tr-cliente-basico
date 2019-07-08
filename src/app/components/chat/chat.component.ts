import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TopicService } from 'src/app/services/topic/topic.service';
import { Message } from 'src/app/services/topic/message';
import { User } from 'src/app/model/user';
import { SEND_OUTGOING_MESSAGES, LISTEN_INCOMING_MESSAGES, LISTEN_SERVER_STATUS_CHANGES} from 'src/app/model/constants';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() public connected: boolean = false;

  private chatElement: HTMLElement;
  private _subscriptionConnection: Subscription;
  private _subscriptionMsgIn: Subscription;

  private user: User;

  public text: string = '';
  // List of received messages
  public messages: Array<any> = new Array<any>();

  constructor(private topicService: TopicService) {
    this._subscriptionConnection = this.topicService.subscribe(LISTEN_SERVER_STATUS_CHANGES, (msg: Message) =>{
      // console.log(`ChatComponent> Recibido evento de conexión/deconexión del servidor. Conectado :${msg.payload}`);
      // In this message the payload carries the server's connection status.
      this.connected = msg.payload;
    });

    this._subscriptionMsgIn = this.topicService.subscribe(LISTEN_INCOMING_MESSAGES, (message: Message) => {
     // console.log('ChatComponent> Recibido mensaje entrante :' + JSON.stringify(message));
     // console.log('ChatComponent> Recibido mensaje entrante :' + message.payload);
      this.messages.push(message);
      this.scrollToBottom();
    });
  }

  ngOnInit() {

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user != null) {
      // Hemos llegado aqui porque el guard lo permite ya que hay conexión.
      this.user = new User(user.username,'','');
    }

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

    if (this.text.trim().length !== 0) {
      // console.log('ChatComponent.sendMessage> Sending message:' + JSON.stringify(this.text));
      this.topicService.publish(SEND_OUTGOING_MESSAGES, new Message(this.user.username, this.text));
      this.text = '';

    }
  }

  ngAfterViewInit() {
    this.chatElement = document.getElementById('chat-messages');
  }

  private scrollToBottom(): any {
    setTimeout(() => {
      this.chatElement.scrollTop =  this.chatElement.scrollHeight;
    }, 50);
  }
}
