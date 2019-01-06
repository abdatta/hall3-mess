import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NavComponent } from '@mess/nav/nav.component';
import { NonvegbookingsComponent } from '@mess/nonvegbookings/nonvegbookings.component';
import { MessLoginComponent } from './mess-login/mess-login.component';

const navs = [
//  { title: 'Notifications', url: '/mess/login', icon: 'notifications', badge: 3 },
    { title: 'Book', url: '/mess/login', icon: 'border_color' }
];

const messRoutes: Routes = [
    {
        path: '',
        component : NavComponent,
        data: { role: 'mess', navs: navs },
        children : [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: MessLoginComponent },
//          { path: 'nonvegbookings', component: NonvegbookingsComponent },
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
