import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildActivationEnd } from '@angular/router/src/events';
import { createViewChildren } from '@angular/compiler/src/core';

// App Components
import { LoginComponent } from '@app/login/login.component';
import { SignupComponent } from '@app/signup/signup.component';
import { ForgotkeyComponent } from '@app/forgotkey/forgotkey.component';
import { HomeComponent } from '@app/home/home.component';
import { BookComponent } from '@app/book/book.component';
import { PrebookComponent } from '@app/prebook/prebook.component';
import { ThisweekComponent } from '@app/thisweek/thisweek.component';
import { HistoryComponent } from '@app/history/history.component';
import { NotwellComponent } from '@app/notwell/notwell.component';
import { GuestroomComponent } from '@app/guestroom/guestroom.component';
import { ChangepasskeyComponent } from '@app/changepasskey/changepasskey.component';

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
        path: 'forgotkey',
        component: ForgotkeyComponent,
        canActivate: [UnAuthGuard]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
