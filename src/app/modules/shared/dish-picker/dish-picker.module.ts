import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material';

import { DishPickerComponent } from './dish-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [DishPickerComponent],
  exports: [DishPickerComponent]
})
export class DishPickerModule { }
