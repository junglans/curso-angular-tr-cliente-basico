import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { TopicService } from 'src/app/services/topic/topic.service';
import { Message } from 'src/app/services/topic/message';
import { LISTEN_SERVER_STATUS_CHANGES } from 'src/app/model/constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
/**
 * Componente que se muestra en el pie y que informa del estado de la conexión con el servidor.
 */
export class FooterComponent implements OnInit, OnDestroy {
  
  @Input ('connected') public _connected: Boolean = false;
  private _subscription: Subscription;

  constructor(private topicService: TopicService) {
    this._subscription = this.topicService.subscribe(LISTEN_SERVER_STATUS_CHANGES, (msg : Message) =>{ 
    //  console.log(`FooterComponent> Recibido evento de conexión/deconexión del servidor. Conectado :${msg.payload}`)
      this._connected = msg.payload
   });

  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this._subscription) {
      this.topicService.unsubscribe(this._subscription);
    }
  }
 
  public get connected(): Boolean {
     return this._connected;
  }
}
