import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessComponent } from '@app/loginformess/mess/mess.component';
import { MesshomeComponent } from '@app/loginformess/messhome/messhome.component';
import { IssuetokenComponent } from '@app/loginformess/issuetoken/issuetoken.component';
import { MesssecyComponent } from '@app/messsecylogin/messsecy/messsecy.component';
import { MesssecyhomeComponent } from '@app/messsecylogin/messsecyhome/messsecyhome.component';
import { NotifyComponent } from '@app/messsecylogin/notify/notify.component';

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
  NotificationComponent,
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
            { path: 'changepasskey', component: ChangepasskeyComponent},
            { path: 'notification', component: NotificationComponent}
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
        component : MesshomeComponent,
        children : [
            { path: '', redirectTo: 'issuetoken', pathMatch: 'full' },
            { path: 'issuetoken', component: IssuetokenComponent},
        ]
    },
    {
        path: 'messsecy',
        component: MesssecyComponent,
    },
    {
        path: 'messsecyhome',
        component: MesssecyhomeComponent,
        children : [
            { path: '', redirectTo: 'notify', pathMatch: 'full' },
            { path: 'notify', component: NotifyComponent},
        ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
