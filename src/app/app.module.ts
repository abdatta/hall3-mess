import { environment } from '../environments/environment';

// Angular Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AppRoutingModule } from '@app/app-routing.module';
import { NgxAnalyticsModule } from 'ngx-analytics';
import { NgxAnalyticsGoogleAnalytics } from 'ngx-analytics/ga';

// App Modules
import { MaterialModule } from '@shared/material';
import { MainNavModule } from '@shared/main-nav';
import { ChangepasskeyModule } from '@shared/changepasskey';

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
import { PWAPromptComponent } from './components/pwa-prompt/pwa-prompt.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgotkeyComponent,
    MessComponent,
    SettingsComponent,
    ControlComponent,
    PWAPromptComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    DeviceDetectorModule.forRoot(),
    NgxAnalyticsModule.forRoot([NgxAnalyticsGoogleAnalytics]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    LayoutModule,
    MaterialModule,
    MainNavModule,
    ChangepasskeyModule
  ],
  providers: [
    AuthService,
    DishesService,
    TokensService
  ],
  entryComponents: [SettingsComponent, PWAPromptComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class PizzaPartyAppModule { }
