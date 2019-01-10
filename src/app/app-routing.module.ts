import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// App Components
import {
  LoginComponent,
  SignupComponent,
  ForgotkeyComponent,
  MessComponent,
  ControlComponent,
  VerifyComponent
} from '@app/components';

// App Guards
import {
  AuthGuard,
  UnAuthGuard,
  MessAuthGuard,
  MessUnAuthGuard
} from '@app/guards';
import { ControlAuthGuard } from './guards/control-auth.guard';
import { ControlUnAuthGuard } from './guards/control-un-auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard, MessUnAuthGuard] },

    { path: 'signup', component: SignupComponent, canActivate: [UnAuthGuard] },

    { path: 'verify/:id', component: VerifyComponent, canActivate: [UnAuthGuard] },

    { path: 'forgotpassword', component: ForgotkeyComponent, canActivate: [UnAuthGuard] },

    { path: 'mess', component : MessComponent, canActivate: [MessUnAuthGuard] },

    { path: 'home', canActivate: [AuthGuard, MessUnAuthGuard, ControlUnAuthGuard], loadChildren: '@home/home.module#HomeModule' },

    { path: 'mess', canActivate: [MessAuthGuard], loadChildren: '@mess/mess.module#MessModule' },

    { path: 'control', canActivate: [AuthGuard, MessUnAuthGuard, ControlAuthGuard], loadChildren: '@control/control.module#ControlModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
