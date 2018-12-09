import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NavComponent } from '@mess/nav/nav.component';
import { ChangemanagerpasswordComponent } from '@mess/changemanagerpassword/changemanagerpassword.component';
import { NonvegbookingsComponent } from '@mess/nonvegbookings/nonvegbookings.component';
import { IssuetokenComponent } from '@mess/issuetoken/issuetoken.component';

const navs = [
  { title: 'Notifications', url: '/mess/issuetoken', icon: 'notifications', badge: 3 },
  { title: 'Issue Token', url: '/mess/issuetoken', icon: 'monetization_on' },
  { title: 'Non-Veg Booking', url: '/mess/nonvegbookings', icon: 'restaurant' },
  { title: 'Change Password', url: '/mess/changepassword', icon: 'vpn_key' }
];

const messRoutes: Routes = [
    {
        path: '',
        component : NavComponent,
        data: { role: 'mess', navs: navs },
        children : [
            { path: '', redirectTo: 'issuetoken', pathMatch: 'full' },
            { path: 'issuetoken', component: IssuetokenComponent},
            { path: 'changepassword', component: ChangemanagerpasswordComponent},
            { path: 'itemslist', component: ChangemanagerpasswordComponent},
            { path: 'nonvegbookings', component: NonvegbookingsComponent},

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
