import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { PageNotFoundComponent } from './pages/pagenotfound/pagenotfound.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'messages', component: MessagesComponent},
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
