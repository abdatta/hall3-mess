import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NavComponent } from '@mess/nav/nav.component';
import { ChangemanagerpasswordComponent } from '@mess/changemanagerpassword/changemanagerpassword.component';
import { NonvegbookingsComponent } from '@mess/nonvegbookings/nonvegbookings.component';
import { IssuetokenComponent } from '@mess/issuetoken/issuetoken.component';


const messRoutes: Routes = [
    {
        path: '',
        component : NavComponent,
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
