import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NavComponent } from '@mess/nav/nav.component';
import { ChangemanagerpasswordComponent } from '@mess/changemanagerpassword/changemanagerpassword.component';
import { NonvegbookingsComponent } from '@mess/nonvegbookings/nonvegbookings.component';
import { BookComponent } from '@mess/book/book.component';
import { MessLoginComponent } from './mess-login/mess-login.component';

// Guards
import { AuthGuard, UnAuthGuard } from '@app/guards';

const navs = [
  { title: 'Notifications', url: '/mess/login', icon: 'notifications', badge: 3 },
  { title: 'Book', url: '/mess/book', icon: 'border_color' },
  { title: 'Non-Veg Booking', url: '/mess/nonvegbookings', icon: 'restaurant' },
  { title: 'Change Password', url: '/mess/changepassword', icon: 'vpn_key' }
];

const messRoutes: Routes = [
    {
        path: '',
        component : NavComponent,
        data: { role: 'mess', navs: navs },
        children : [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: MessLoginComponent, canActivate: [UnAuthGuard] },
            { path: 'book', component: BookComponent, canActivate: [AuthGuard] },
            { path: 'changepassword', component: ChangemanagerpasswordComponent },
            { path: 'nonvegbookings', component: NonvegbookingsComponent },
        ]
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(messRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MessRouterModule {}
