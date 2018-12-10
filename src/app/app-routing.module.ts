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

import { AuthGuard, UnAuthGuard } from '@app/guards';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard] },

    { path: 'signup', component: SignupComponent, canActivate: [UnAuthGuard] },

    { path: 'forgotpassword', component: ForgotkeyComponent, canActivate: [UnAuthGuard] },

    { path: 'mess', component : MessComponent },

    { path: 'control', component: ControlComponent },

    { path: 'home', canActivate: [AuthGuard], loadChildren: '@home/home.module#HomeModule' },

    { path: 'mess', loadChildren: '@mess/mess.module#MessModule' },

    { path: 'control', loadChildren: '@control/control.module#ControlModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
