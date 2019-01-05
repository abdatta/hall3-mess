import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatFormFieldModule,
  MatCardModule,
  MatTableModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatTabsModule,
  MatSnackBarModule,
  MatGridListModule,
  MatMenuModule,
  MatBadgeModule,
  MatDialogModule,
  MatBottomSheetModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSnackBarModule,
    MatGridListModule,
    MatMenuModule,
    MatBadgeModule,
    MatDialogModule,
    MatBottomSheetModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSnackBarModule,
    MatGridListModule,
    MatMenuModule,
    MatBadgeModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 }
    }
  ]
})
export class MaterialModule { }
