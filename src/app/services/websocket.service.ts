import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Esto significa que no debe declararse en el módulo
})
export class WebsocketService {

  private _connected: Boolean = false;
  public _subject: ReplaySubject<Boolean> = new ReplaySubject<Boolean>();

  constructor(private socket: Socket) { 

      this.checkServerStatus();

  }

  public checkServerStatus(): void {

      this.socket.on('connect', () => {
          console.log('Conectado al servidor');
          this._connected = true;
          this._subject.next(this._connected);
      });

      this.socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
        this._connected = false;
        this._subject.next(this._connected);
    });
  }

  public get connected() {
    return this._connected;
  }

  public get subject(): ReplaySubject<Boolean> {
      return this._subject;
  }
}
