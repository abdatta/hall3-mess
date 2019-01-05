import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NavComponent } from '@control/nav/nav.component';
import { NotifyComponent } from '@control/notify/notify.component';
import { EditDishesComponent } from '@control/edit-dishes/edit-dishes.component';
import { MakebillsComponent } from '@control/makebills/makebills.component';
import { ChangepasskeyComponent } from '@shared/changepasskey/changepasskey.component';

const navs = [
    { title: 'Notifications', url: '/control/notify', icon: 'notifications', badge: 3 },
    { title: 'Notify People', url: '/control/notify', icon: 'notifications_active' },
    { title: 'Edit Dishes', url: '/control/edititem', icon: 'settings' },
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
            { path: 'edititem', component: EditDishesComponent},
            { path: 'changepassword', component: ChangepasskeyComponent},
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
