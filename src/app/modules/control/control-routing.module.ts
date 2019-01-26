import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NavComponent } from '@control/nav/nav.component';
import { NotifyComponent } from '@control/notify/notify.component';
import { EditDishesComponent } from '@control/edit-dishes/edit-dishes.component';
import { MakebillsComponent } from '@control/makebills/makebills.component';
import { ChangepasskeyComponent } from '@shared/changepasskey/changepasskey.component';
import { EditTokenComponent } from '@control/edit-token/edit-token.component';
import { ControlAuthGuard } from '@app/guards';

const navs = [
//  { title: 'Notifications', url: '/control/notify', icon: 'notifications', badge: 3 },
//  { title: 'Notify People', url: '/control/notify', icon: 'notifications_active' },
    { title: 'Edit Dishes', url: '/control/editdishes', icon: 'settings', permissions: ['edit_dishes'] },
    { title: 'Make Bills', url: '/control/makebills', icon: 'attach_money', permissions: ['make_bills'] },
    { title: 'Reduce Token', url: '/control/reducetoken', icon: 'stars', permissions: ['reduce_token'] },
    { title: 'Change Password', url: '/control/changepassword', icon: 'vpn_key' }
  ];

const controlRoutes: Routes = [
    {
        path: '',
        component: NavComponent,
        data: { role: 'secy', navs: navs },
        children : [
            { path: '', redirectTo: 'editdishes', pathMatch: 'full' },
//          { path: 'notify', component: NotifyComponent},
            {
              path: 'editdishes',
              component: EditDishesComponent,
              canActivate: [ControlAuthGuard],
              data: { permissions: ['edit_dishes'], redirectTo: '/control/reducetoken' }
            },
            { path: 'reducetoken',
              component: EditTokenComponent,
              canActivate: [ControlAuthGuard],
              data: { permissions: ['reduce_token'], redirectTo: '/control/makebills' }
            },
            {
              path: 'makebills',
              component: MakebillsComponent,
              canActivate: [ControlAuthGuard],
              data: { permissions: ['make_bills'], redirectTo: '/control/changepassword' }
            },
            { path: 'changepassword', component: ChangepasskeyComponent}
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
