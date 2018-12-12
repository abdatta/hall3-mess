import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// App Components
import {
  LoginComponent,
  SignupComponent,
  ForgotkeyComponent,
  MessComponent,
  ControlComponent
} from '@app/components';

// App Guards
import {
  AuthGuard,
  UnAuthGuard,
  MessAuthGuard,
  MessUnAuthGuard
} from '@app/guards';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard, MessUnAuthGuard] },

    { path: 'signup', component: SignupComponent, canActivate: [UnAuthGuard, MessUnAuthGuard] },

    { path: 'forgotpassword', component: ForgotkeyComponent, canActivate: [UnAuthGuard, MessUnAuthGuard] },

    { path: 'mess', component : MessComponent, canActivate: [MessUnAuthGuard] },

    { path: 'control', component: ControlComponent },

    { path: 'home', canActivate: [AuthGuard, MessUnAuthGuard], loadChildren: '@home/home.module#HomeModule' },

    { path: 'mess', canActivate: [MessAuthGuard], loadChildren: '@mess/mess.module#MessModule' },

    { path: 'control', loadChildren: '@control/control.module#ControlModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
