import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const navs = [
  { title: 'Notifications', url: '/home/notifications', icon: 'notifications', badge: 3 },
  { title: 'Book', url: '/home/book', icon: 'border_color' },
  { title: 'Pre-book', url: '/home/prebook', icon: 'restaurant' },
  { title: 'Menu This Week', url: '/home/thisweek', icon: 'restaurant_menu' },
  { title: 'Bills and History', url: '/home/history', icon: 'calendar_today' },
  { title: 'Not Well', url: '/home/notwell', icon: 'local_hospital' },
  { title: 'Change Password', url: '/home/changepassword', icon: 'vpn_key' },
  { title: 'Book Guestroom', url: '/home/guestroom', icon: 'hotel' }
];

const homeRoutes: Routes = [
    {
        path: '',
        component: NavComponent,
        data: { role: 'resident', navs: navs },
        children : [
            { path: '', redirectTo: 'book', pathMatch: 'full' },
            { path: 'book', component: BookComponent },
            { path: 'prebook', component: PrebookComponent },
            { path: 'thisweek', component: ThisweekComponent },
            { path: 'history', component: HistoryComponent},
            { path: 'notwell', component: NotwellComponent},
            { path: 'guestroom', component: GuestroomComponent},
            { path: 'changepassword', component: ChangepasskeyComponent},
            { path: 'notifications', component: NotificationComponent}
        ]
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRouterModule {}
