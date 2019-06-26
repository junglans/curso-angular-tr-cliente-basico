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
          console.log('WebsocketService> Conectado al servidor');
          this._connected = true;
          this._subject.next(this._connected);
      });

      this.socket.on('disconnect', () => {
        console.log('WebsocketService> Desconectado del servidor');
        this._connected = false;
        this._subject.next(this._connected);
    });
  }

  public sendMessage(eventName: string, payload?: any, callback?: Function): void {
    console.log('WebsocketService> enviando mensaje eventName: ' + eventName + 'con payload :' + JSON.stringify(payload));
    this.socket.emit(eventName, payload, callback);
  }

  public get connected() {
    return this._connected;
  }

  public get subject(): ReplaySubject<Boolean> {
      return this._subject;
  }
}
