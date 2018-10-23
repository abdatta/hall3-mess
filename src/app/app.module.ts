import { environment } from '../environments/environment';

// Angular Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from '@app/app-routing.module';


// Material Modules
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

// Services
import { DishesService } from '@app/services/dishes.service';

// Components
import { AppComponent } from '@app/app.component';
import { LoginComponent } from '@app/login/login.component';
import { SignupComponent } from '@app/signup/signup.component';
import { HomeComponent } from '@app/home/home.component';
import { MainNavComponent } from '@app/main-nav/main-nav.component';
import { BookComponent } from '@app/book/book.component';
import { PrebookComponent } from '@app/prebook/prebook.component';
import { ThisweekComponent } from '@app/thisweek/thisweek.component';
import { HistoryComponent } from '@app/history/history.component';
import { NotwellComponent } from '@app/notwell/notwell.component';
import { ChangepasskeyComponent } from '@app/changepasskey/changepasskey.component';
import { GuestroomComponent } from '@app/guestroom/guestroom.component';
import { ForgotkeyComponent } from '@app/forgotkey/forgotkey.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    MainNavComponent,
    BookComponent,
    PrebookComponent,
    ThisweekComponent,
    HistoryComponent,
    NotwellComponent,
    ChangepasskeyComponent,
    GuestroomComponent,
    ForgotkeyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    LayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule
  ],
  providers: [
    DishesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class PizzaPartyAppModule { }
