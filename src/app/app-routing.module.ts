import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesssecyComponent } from '@app/components/messsecycomponents/messsecy/messsecy.component';
import { MesssecyhomeComponent } from '@app/components/messsecycomponents/messsecyhome/messsecyhome.component';
import { NotifyComponent } from '@app/components/messsecycomponents/notify/notify.component';
import {
    ChangemesssecypasswordComponent
} from '@app/components/messsecycomponents/changemesssecypassword/changemesssecypassword.component';

import { ChangemanagerpasswordComponent } from '@app/components/managercomponents/changemanagerpassword/changemanagerpassword.component';
import { NonvegbookingsComponent } from '@app/components/managercomponents/nonvegbookings/nonvegbookings.component';
import { MessComponent } from '@app/components/managercomponents/mess/mess.component';
import { MesshomeComponent } from '@app/components/managercomponents/messhome/messhome.component';
import { IssuetokenComponent } from '@app/components/managercomponents/issuetoken/issuetoken.component';
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
} from '@app/components/residentcomponents';

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
            { path: 'changepassword', component: ChangepasskeyComponent},
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
            { path: 'changepassword', component: ChangemanagerpasswordComponent},
            { path: 'itemlist', component: BookComponent},
            { path: 'nonvegbookings', component: NonvegbookingsComponent},
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
            { path: 'changepassword', component: ChangemesssecypasswordComponent},
        ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
