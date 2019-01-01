import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlRouterModule } from '@control/control-routing.module';
import { MaterialModule } from '@shared/material';
import { MainNavModule } from '@shared/main-nav';
import { ChangepasskeyModule } from '@shared/changepasskey';

// Components
import { NavComponent } from '@control/nav/nav.component';
import { NotifyComponent } from '@control/notify/notify.component';
import { EdititemComponent } from '@control/edititem/edititem.component';
import { MakebillsComponent } from '@control/makebills/makebills.component';

@NgModule({
  imports: [
    CommonModule,
    ControlRouterModule,
    MaterialModule,
    MainNavModule,
    ChangepasskeyModule
  ],
  declarations: [
    NavComponent,
    NotifyComponent,
    EdititemComponent,
    MakebillsComponent
  ]
})
export class ControlModule { }
