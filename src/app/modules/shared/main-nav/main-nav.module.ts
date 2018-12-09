import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material';

import { MainNavComponent } from '@shared/main-nav/main-nav.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    MainNavComponent
  ],
  exports: [
    MainNavComponent
  ]
})
export class MainNavModule { }
