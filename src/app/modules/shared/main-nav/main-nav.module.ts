import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material';

import { MainNavComponent } from '@shared/main-nav/main-nav.component';

import { RecentsComponent } from '@shared/main-nav/recents/recents.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
  ],
  declarations: [
    MainNavComponent,
    RecentsComponent
  ],
  exports: [
    MainNavComponent
  ]
})
export class MainNavModule { }
