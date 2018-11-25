import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessComponent } from '@app/loginformess/mess/mess.component';
import { MesshomeComponent } from '@app/loginformess/messhome/messhome.component';

// App Components
import {
  LoginComponent,
  SignupComponent,
  HomeComponent,
  BookComponent,
  PrebookComponent,
  ThisweekComponent,
  HistoryComponent,
  NotwellComponent,
  ChangepasskeyComponent,
  GuestroomComponent,
  ForgotkeyComponent,
} from '@app/components';

import { AuthGuard, UnAuthGuard } from '@app/guards';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [UnAuthGuard]
    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [UnAuthGuard]
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        children : [
            { path: '', redirectTo: 'book', pathMatch: 'full' },
            { path: 'book', component: BookComponent },
            { path: 'prebook', component: PrebookComponent },
            { path: 'thisweek', component: ThisweekComponent },
            { path: 'history', component: HistoryComponent},
            { path: 'notwell', component: NotwellComponent},
            { path: 'guestroom', component: GuestroomComponent},
            { path: 'changepasskey', component: ChangepasskeyComponent}
        ]
    },
    {
        path: 'forgotpassword',
        component: ForgotkeyComponent,
        canActivate: [UnAuthGuard]
    },
    {
        path: 'mess',
        component : MessComponent,
        canActivate: [UnAuthGuard]
    },
    {
        path: 'messhome',
        component : MesshomeComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
