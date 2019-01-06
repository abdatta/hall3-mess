import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material';
import { MessOutDialogComponent } from '@shared/main-nav/mess-out-dialog/mess-out-dialog.component';
import { MainNavComponent } from '@shared/main-nav/main-nav.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
  ],
  declarations: [
    MainNavComponent,
    MessOutDialogComponent
  ],
  exports: [
    MainNavComponent
  ],
  entryComponents: [MessOutDialogComponent]
})
export class MainNavModule { }
