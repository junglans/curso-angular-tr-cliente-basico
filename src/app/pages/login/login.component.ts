import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username:string = '';
  constructor(private wsService: WebsocketService) { }

  ngOnInit() {
  }

  public login(): void {
      this.wsService.login(this.username);
  }
}
