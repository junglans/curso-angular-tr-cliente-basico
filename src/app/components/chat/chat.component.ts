import { Component, OnInit, OnDestroy, ViewChild, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TopicService } from 'src/app/services/topic/topic.service';
import { Message } from 'src/app/services/topic/message';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  private chatElement: HTMLElement;

  private _connected: boolean = false;
  private _subscriptionConnection: Subscription;
  private _subscriptionMsgIn: Subscription;

  private user: User;

  public text: string = '';
  // List of received messages
  public messages: Array<any> = new Array<any>();

  constructor(private topicService: TopicService, private router: Router) {
    this._subscriptionConnection = this.topicService.subscribe('SERVER_STATUS', (msg: Message) =>{
      console.log(`ChatComponent> Recibido evento de conexión/deconexión del servidor. Conectado :${msg.payload}`);
      // In this message the payload carries the server's connection status.
      this._connected = msg.payload;
      if (!this._connected) {
          this.router.navigateByUrl('/');
      }
    });

    this._subscriptionMsgIn = this.topicService.subscribe('MESSAGE_IN', (message: Message) => {
      console.log('ChatComponent> Recibido mensaje entrante :' + JSON.stringify(message));
      console.log('ChatComponent> Recibido mensaje entrante :' + message.payload);
      this.messages.push(message);
      this.scrollToBottom();
    });
  }

  ngOnInit() {

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user != null) {
      // Hemos llegado aqui porque el guard lo permite ya que hay conexión.
      this.user = new User(user._username);
      this._connected = true;
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

      console.log('ChatComponent.sendMessage> Sending message:' + JSON.stringify(this.text));
      this.topicService.publish('MESSAGE_OUT', new Message(this.user.username, this.text));
      this.text = '';

    }
  }

  public isConnected(): boolean {
    return this._connected;
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
