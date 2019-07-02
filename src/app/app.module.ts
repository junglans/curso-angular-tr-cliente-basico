import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
// sockets
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { FooterComponent } from './components/footer/footer.component';
import { ChatComponent } from './components/chat/chat.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { LoginComponent } from './pages/login/login.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { AppRoutingModule } from './approuting.module';
import { PageNotFoundComponent } from './pages/pagenotfound/pagenotfound.component';

const config: SocketIoConfig = {
  url: environment.wsUrl, options: {}
};

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    ChatComponent,
    UserlistComponent,
    LoginComponent,
    MessagesComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor() {
    console.log('AppModule loaded');
  }
}
