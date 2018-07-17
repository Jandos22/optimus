// 3rd Party Modules
import { MaterialModule } from './shared/libraries/material.module';
import { SimpleNotificationsModule } from 'angular2-notifications';

// font awesome icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fromFontAwesome from './shared/libraries/fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(fromFontAwesome.fontawesome_icons);

// My Modules & Components
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HarcsStatusCheckModule } from './apps/harcs/modules/status-check/harcs-status-check.module';
import { ExemptionsStatusCheckModule } from './apps/exemptions/modules/status-check/exemptions-status-check.module';

// Angular Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { environment } from '../environments/environment';

// NgRx
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {
  StoreRouterConnectingModule,
  RouterStateSerializer
} from '@ngrx/router-store';

import { reducers, root, effects, CustomSerializer } from './store';

// not used in production
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';

export const metaReducers: MetaReducer<any>[] = !environment.production
  ? [storeFreeze]
  : [];

// modules
import { RegistrationModule } from './apps/registration/registration.module';

// containers
import { AppComponent } from './app.component';
import * as fromLayout from './layout';

// components
import * as fromComponents from './shared/components';

// services
import * as fromServices from './shared/services';

// pipes
import * as fromPipes from './shared/pipes';

// guards
import { AuthGuard } from './shared/guards/auth.guard';
import { GlobalErrorHandlerService } from './shared/services/global-error-handler.service';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule
} from '@angular/material/core';

import * as fromDateFormats from './shared/date/date.formats';

@NgModule({
  declarations: [
    AppComponent,
    ...fromLayout.containers,
    ...fromComponents.components
  ],
  entryComponents: [fromComponents.ErrorDialogBoxComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FontAwesomeModule,
    SimpleNotificationsModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature('root', root),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule,
    RegistrationModule,
    MatNativeDateModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    // used in sidenav
    HarcsStatusCheckModule,
    ExemptionsStatusCheckModule
  ],
  providers: [
    Title,
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    ...fromServices.services,
    AuthGuard,
    {
      provide: DateAdapter,
      useClass: MatNativeDateModule,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: fromDateFormats.formats }
  ],
  exports: [SharedModule, FontAwesomeModule, SimpleNotificationsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
