import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PageNotFoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { MustMatchDirective } from './directives/mustmatch.directive';
import { AppRoutingModule } from './approuting.module';
import { ClaimsRegistrationComponent } from './pages/claims/claims.component';

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
    PageNotFoundComponent,
    RegistrationComponent,
    MustMatchDirective,
    ClaimsRegistrationComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor() {
    console.log('AppModule loaded');
  }
}
