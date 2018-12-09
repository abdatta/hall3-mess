import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessRouterModule } from '@mess/mess-routing.module';
import { MaterialModule } from '@shared/material';
import { MainNavModule } from '@shared/main-nav';

// Components
import { NavComponent } from '@mess/nav/nav.component';
import { ChangemanagerpasswordComponent } from '@mess/changemanagerpassword/changemanagerpassword.component';
import { NonvegbookingsComponent } from '@mess/nonvegbookings/nonvegbookings.component';
import { IssuetokenComponent } from '@mess/issuetoken/issuetoken.component';

@NgModule({
  imports: [
    CommonModule,
    MessRouterModule,
    MaterialModule,
    MainNavModule
  ],
  declarations: [
    NavComponent,
    ChangemanagerpasswordComponent,
    NonvegbookingsComponent,
    IssuetokenComponent,
    NavComponent
  ]
})
export class MessModule { }
