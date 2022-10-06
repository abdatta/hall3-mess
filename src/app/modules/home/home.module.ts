import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeRouterModule } from '@home/home-routing.module';
import { MaterialModule } from '@shared/material';
import { MainNavModule } from '@shared/main-nav';
import { ChangepasskeyModule } from '@shared/changepasskey';
import { DishPickerModule } from '@shared/dish-picker';
import { NgxKjuaModule } from 'ngx-kjua';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Components
import { NavComponent } from '@home/nav/nav.component';
import { BookComponent } from '@home/book/book.component';
import { PrebookComponent } from '@home/prebook/prebook.component';
import { ThisweekComponent } from '@home/thisweek/thisweek.component';
import { HistoryComponent } from '@home/history/history.component';
import { NotwellComponent } from '@home/notwell/notwell.component';
import { GuestroomComponent } from '@home/guestroom/guestroom.component';
import { NotificationComponent } from '@home/notification/notification.component';
import { QRDialogComponent } from './qr-dialog/qr-dialog.component';
import { CreditsComponent } from './credits/credits.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomeRouterModule,
    MaterialModule,
    MainNavModule,
    NgxKjuaModule,
    DishPickerModule,
    ChangepasskeyModule,
    InfiniteScrollModule
  ],
  declarations: [
    NavComponent,
    BookComponent,
    PrebookComponent,
    ThisweekComponent,
    HistoryComponent,
    NotwellComponent,
    GuestroomComponent,
    NotificationComponent,
    QRDialogComponent,
    CreditsComponent
  ],
  entryComponents: [QRDialogComponent]
})
export class HomeModule { }
