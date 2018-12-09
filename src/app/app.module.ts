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

// App Modules
import { MaterialModule } from '@shared/material';
import { MainNavModule } from '@shared/main-nav';

// App Services
import {
  AuthService,
  DishesService,
  TokensService
} from '@app/services';

// App Components
import { AppComponent } from '@app/app.component';
import {
  LoginComponent,
  SignupComponent,
  ForgotkeyComponent,
  MessComponent,
  ControlComponent
} from '@app/components';

import { SettingsComponent } from '@app/components/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgotkeyComponent,
    MessComponent,
    SettingsComponent,
    ControlComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    LayoutModule,
    MaterialModule,
    MainNavModule
  ],
  providers: [
    AuthService,
    DishesService,
    TokensService
  ],
  entryComponents: [SettingsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class PizzaPartyAppModule { }
