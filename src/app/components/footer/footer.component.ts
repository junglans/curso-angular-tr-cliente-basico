import { Component, OnInit, OnDestroy} from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit, OnDestroy {
  
  private _connected: Boolean = false;

  constructor(private wsService: WebsocketService) {}

  ngOnInit(): void {
     this._connected = this.wsService.connected;
     this.wsService.subject.subscribe((connected : Boolean) =>{ 
       console.log(`Recibido evento de conexión/deconexión del servidor ${connected}`)
       this._connected = connected
    });
  }
  ngOnDestroy(): void {
     this.wsService.subject.unsubscribe();
  }
 
  public get connected(): Boolean {
     return this._connected;
  }
}
