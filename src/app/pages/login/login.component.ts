import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string = '';
  constructor(private wsService: WebsocketService, private router: Router) { }

  ngOnInit() {}

  public login(): void {
      this.wsService.login(this.username).
        then((data) => {
          console.log('Resolve :' + data);
          this.router.navigateByUrl('/messages');
        }).catch((err) => {
          console.log('Reject :' + err)
      });
  }
}
