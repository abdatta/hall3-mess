import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// App Components
import {
  LoginComponent,
  SignupComponent,
  ForgotkeyComponent,
  MessComponent,
  VerifyComponent,
  DeleteComponent,
  ResetPasswordComponent
} from '@app/components';

// App Guards
import {
  AuthGuard,
  UnAuthGuard,
  MessAuthGuard,
  MessUnAuthGuard,
  ControlAuthGuard,
  ControlUnAuthGuard
} from '@app/guards';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard, MessUnAuthGuard] },

    { path: 'signup', component: SignupComponent, canActivate: [UnAuthGuard] },

    { path: 'verify/:id', component: VerifyComponent, canActivate: [UnAuthGuard] },

    { path: 'delete/:id', component: DeleteComponent, canActivate: [UnAuthGuard] },

    { path: 'reset/:id', component: ResetPasswordComponent, canActivate: [UnAuthGuard] },

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
