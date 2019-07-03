import { Injectable } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Router, CanLoad, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserguardService implements CanActivate {
  

  constructor(private router: Router, private wsService: WebsocketService) { }

  canActivate(): boolean {
    if (this.wsService.user === null) {
      this.router.navigateByUrl("/");
      return false;
    }
    return true;
  }
}
