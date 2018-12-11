import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MessRouterModule } from '@mess/mess-routing.module';
import { MaterialModule } from '@shared/material';
import { MainNavModule } from '@shared/main-nav';
import { DishPickerModule } from '@shared/dish-picker';

// Components
import { NavComponent } from '@mess/nav/nav.component';
import { ChangemanagerpasswordComponent } from '@mess/changemanagerpassword/changemanagerpassword.component';
import { NonvegbookingsComponent } from '@mess/nonvegbookings/nonvegbookings.component';
import { BookComponent } from '@mess/book/book.component';
import { MessLoginComponent } from '@mess/mess-login/mess-login.component';
import { QRBookComponent } from '@mess/qr-book/qr-book.component';

@NgModule({
  imports: [
    CommonModule,
    ZXingScannerModule,
    MessRouterModule,
    MaterialModule,
    MainNavModule,
    DishPickerModule
  ],
  declarations: [
    NavComponent,
    ChangemanagerpasswordComponent,
    NonvegbookingsComponent,
    NavComponent,
    BookComponent,
    MessLoginComponent,
    QRBookComponent
  ],
  entryComponents: [QRBookComponent]
})
export class MessModule { }
