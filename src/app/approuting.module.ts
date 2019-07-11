import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { PageNotFoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { UserGuard } from './guards/userguard.service';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ClaimsRegistrationComponent } from './pages/claims/claims.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'claims', component: ClaimsRegistrationComponent},
  { path: 'messages', component: MessagesComponent, canActivate: [ UserGuard ]},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
        appRoutes,
        { enableTracing: false } // <-- debugging purposes only
      )
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
  constructor() {
    console.log('AppRoutingModule loaded');
  }
}
