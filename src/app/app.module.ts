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
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material';

// Services
import {
  AuthService,
  DishesService,
  TokensService
} from '@app/services';

// Components
import { AppComponent } from '@app/app.component';
import {
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
} from '@app/components';
import { MessComponent } from '@app/loginformess/mess/mess.component';
import { MesshomeComponent } from '@app/loginformess/messhome/messhome.component';
import { IssuetokenComponent } from '@app/loginformess/issuetoken/issuetoken.component';

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
    ForgotkeyComponent,
    MessComponent,
    MesshomeComponent,
    IssuetokenComponent
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
    MatBadgeModule
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 }
    },
    AuthService,
    DishesService,
    TokensService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class PizzaPartyAppModule { }
