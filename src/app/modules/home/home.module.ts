import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeRouterModule } from '@home/home-routing.module';
import { MaterialModule } from '@shared/material';
import { MainNavModule } from '@shared/main-nav';

// Components
import { NavComponent } from '@home/nav/nav.component';
import { BookComponent } from '@home/book/book.component';
import { PrebookComponent } from '@home/prebook/prebook.component';
import { ThisweekComponent } from '@home/thisweek/thisweek.component';
import { HistoryComponent } from '@home/history/history.component';
import { NotwellComponent } from '@home/notwell/notwell.component';
import { ChangepasskeyComponent } from '@home/changepasskey/changepasskey.component';
import { GuestroomComponent } from '@home/guestroom/guestroom.component';
import { NotificationComponent } from '@home/notification/notification.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomeRouterModule,
    MaterialModule,
    MainNavModule
  ],
  declarations: [
    NavComponent,
    BookComponent,
    PrebookComponent,
    ThisweekComponent,
    HistoryComponent,
    NotwellComponent,
    ChangepasskeyComponent,
    GuestroomComponent,
    NotificationComponent
  ]
})
export class HomeModule { }
