import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NavComponent } from '@control/nav/nav.component';
import { NotifyComponent } from '@control/notify/notify.component';
import { ChangemesssecypasswordComponent } from '@control/changemesssecypassword/changemesssecypassword.component';
import { EdititemComponent } from '@control/edititem/edititem.component';
import { MakebillsComponent } from '@control/makebills/makebills.component';

const navs = [
    { title: 'Notifications', url: '/control/notify', icon: 'notifications', badge: 3 },
    { title: 'Notify People', url: '/control/notify', icon: 'notifications_active' },
    { title: 'Edit items', url: '/control/edititem', icon: 'settings' },
    { title: 'Make Bills', url: '/control/makebills', icon: 'account_balance_wallet' },
    { title: 'Change Password', url: '/control/changepassword', icon: 'vpn_key' }
  ];

const controlRoutes: Routes = [
    {
        path: '',
        component: NavComponent,
        data: { role: 'secy', navs: navs },
        children : [
            { path: '', redirectTo: 'notify', pathMatch: 'full' },
            { path: 'notify', component: NotifyComponent},
            { path: 'edititem', component: EdititemComponent},
            { path: 'changepassword', component: ChangemesssecypasswordComponent},
            { path: 'makebills', component: MakebillsComponent},
        ]
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(controlRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ControlRouterModule {}
