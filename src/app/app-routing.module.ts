import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';     // Add your component here
import { SignupComponent } from './signup/signup.component';  // Add your component here
import { HomeComponent } from './home/home.component';
import { ChildActivationEnd } from '@angular/router/src/events';
import { createViewChildren } from '@angular/compiler/src/core';
import { MainNavComponent } from './main-nav/main-nav.component';

//This is my case 
const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        children: [
          {  path:'',
            component: MainNavComponent,
          }
        ]
        
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }