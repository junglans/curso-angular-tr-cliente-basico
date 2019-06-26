import { Component, OnInit, OnDestroy} from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

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

  constructor(private wsService: WebsocketService) {}

  ngOnInit(): void {
     this._connected = this.wsService.connected;
     this._subscription = this.wsService.subject.subscribe((connected : Boolean) =>{ 
       console.log(`FooterComponent> Recibido evento de conexión/deconexión del servidor. Conectado :${connected}`)
       this._connected = connected
    });
  }

  ngOnDestroy(): void {
     this._subscription.unsubscribe();
  }
 
  public get connected(): Boolean {
     return this._connected;
  }
}
