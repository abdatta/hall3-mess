import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlRouterModule } from '@control/control-routing.module';
import { MaterialModule } from '@shared/material';
import { MainNavModule } from '@shared/main-nav';

// Components
import { NavComponent } from '@control/nav/nav.component';
import { NotifyComponent } from '@control/notify/notify.component';
import { ChangemesssecypasswordComponent } from '@control/changemesssecypassword/changemesssecypassword.component';
import { EdititemComponent } from '@control/edititem/edititem.component';
import { MakebillsComponent } from '@control/makebills/makebills.component';

@NgModule({
  imports: [
    CommonModule,
    ControlRouterModule,
    MaterialModule,
    MainNavModule
  ],
  declarations: [
    NavComponent,
    NotifyComponent,
    ChangemesssecypasswordComponent,
    EdititemComponent,
    MakebillsComponent
  ]
})
export class ControlModule { }
