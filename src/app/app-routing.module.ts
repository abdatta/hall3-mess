import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';     // Add your component here
import { SignupComponent } from './signup/signup.component';  // Add your component here

import { HomeComponent } from './home/home.component';

import { ChildActivationEnd } from '@angular/router/src/events';
import { createViewChildren } from '@angular/compiler/src/core';

import { MainNavComponent } from './main-nav/main-nav.component';

import { BookComponent } from './book/book.component';
import { PrebookComponent } from './prebook/prebook.component';
import { ThisweekComponent } from './thisweek/thisweek.component';
import { HistoryComponent } from './history/history.component';
import { NotwellComponent } from './notwell/notwell.component';

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
        children : [
            { path: '', component: BookComponent },
            { path: 'book', component: BookComponent },
            { path: 'prebook', component: PrebookComponent },
            { path: 'thisweek', component: ThisweekComponent },
            { path: 'history', component: HistoryComponent},
            { path: 'notwell', component: NotwellComponent}
        ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
