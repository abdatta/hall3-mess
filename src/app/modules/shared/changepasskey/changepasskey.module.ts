import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material';

import { ChangepasskeyComponent } from '@shared/changepasskey/changepasskey.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
  ],
  declarations: [
    ChangepasskeyComponent
  ],
  exports: [
    ChangepasskeyComponent
  ]
})

export class ChangepasskeyModule { }
