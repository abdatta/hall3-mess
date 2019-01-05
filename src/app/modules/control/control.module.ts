import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlRouterModule } from '@control/control-routing.module';
import { MaterialModule } from '@shared/material';
import { MainNavModule } from '@shared/main-nav';
import { ChangepasskeyModule } from '@shared/changepasskey';
import { MatFormFieldModule } from '@angular/material/form-field';

// Components
import { NavComponent } from '@control/nav/nav.component';
import { NotifyComponent } from '@control/notify/notify.component';
import { MakebillsComponent } from '@control/makebills/makebills.component';
import { EditDishesComponent } from '@control/edit-dishes/edit-dishes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ControlRouterModule,
    MaterialModule,
    MainNavModule,
    ChangepasskeyModule,
    MatFormFieldModule
  ],
  declarations: [
    NavComponent,
    NotifyComponent,
    MakebillsComponent,
    EditDishesComponent
  ]
})
export class ControlModule { }
