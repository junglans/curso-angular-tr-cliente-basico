import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root' // Esto significa que no debe declararse en el módulo
})
export class WebsocketService {

  public connected: Boolean = false;

  constructor(private socket: Socket) { 

      this.checkServerStatus();

  }

  public checkServerStatus(): void {
      this.socket.on('connect', () => {
          console.log('Conectado al servidor');
          this.connected = true;
      });
      this.socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
        this.connected = false;
    });
  }
}
