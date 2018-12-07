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
  MatDialogModule,
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
  BookComponent,
  PrebookComponent,
  ThisweekComponent,
  HistoryComponent,
  NotwellComponent,
  ChangepasskeyComponent,
  GuestroomComponent,
  ForgotkeyComponent,
  NotificationComponent
} from '@app/components/residentcomponents';

import { MesssecyComponent } from '@app/components/messsecycomponents/messsecy/messsecy.component';
import { MesssecyhomeComponent } from '@app/components/messsecycomponents/messsecyhome/messsecyhome.component';
import { NotifyComponent } from '@app/components/messsecycomponents/notify/notify.component';
import {
  ChangemesssecypasswordComponent
} from '@app/components/messsecycomponents/changemesssecypassword/changemesssecypassword.component';

import { ChangemanagerpasswordComponent } from '@app/components/managercomponents/changemanagerpassword/changemanagerpassword.component';
import { NonvegbookingsComponent } from '@app/components/managercomponents/nonvegbookings/nonvegbookings.component';
import { MessComponent } from '@app/components/managercomponents/mess/mess.component';
import { MesshomeComponent } from '@app/components/managercomponents/messhome/messhome.component';
import { IssuetokenComponent } from '@app/components/managercomponents/issuetoken/issuetoken.component';
import { EdititemComponent } from '@app/components/messsecycomponents/edititem/edititem.component';
import { SettingsComponent } from '@app/components/residentcomponents/settings/settings.component';
import { MakebillsComponent } from '@app/components/messsecycomponents/makebills/makebills.component';
import { MainNavComponent } from '@app/components/sharedcomponents/main-nav/main-nav.component';

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
    IssuetokenComponent,
    NotificationComponent,
    MesssecyComponent,
    MesssecyhomeComponent,
    NotifyComponent,
    ChangemesssecypasswordComponent,
    ChangemanagerpasswordComponent,
    NonvegbookingsComponent,
    EdititemComponent,
    SettingsComponent,
    MakebillsComponent
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
    MatBadgeModule,
    MatDialogModule
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
  entryComponents: [SettingsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class PizzaPartyAppModule { }
