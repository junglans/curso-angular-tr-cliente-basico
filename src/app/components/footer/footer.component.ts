import { Component, OnInit, OnDestroy} from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { TopicService } from 'src/app/services/topic/topic.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
/**
 * Componente que se muestra en el pie y que informa del estado de la conexión con el servidor.
 */
export class FooterComponent implements OnInit, OnDestroy {
  
  private _connected: Boolean = false;
  private _subscription: Subscription;

  constructor(private topicService: TopicService) {}

  ngOnInit(): void {
    this._subscription = this.topicService.subscribe("SERVER_STATUS", (connected : Boolean) =>{ 
      console.log(`FooterComponent> Recibido evento de conexión/deconexión del servidor. Conectado :${connected}`)
      this._connected = connected
   })
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this.topicService.unsubscribe(this._subscription);
    }
  }
 
  public get connected(): Boolean {
     return this._connected;
  }
}
