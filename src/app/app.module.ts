// 3rd Party Modules
import { MaterialModule } from './shared/libraries/material.module';

// My Modules & Components
import { AppRoutingModule } from './app-routing.module';

// Angular Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { environment } from './../environments/environment';

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

// services
import * as fromServices from './services';

// guards
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [AppComponent, ...fromLayout.containers],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature('root', root),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule,
    AppRoutingModule,
    RegistrationModule,
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    Title,
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    ...fromServices.services,
    AuthGuard
  ],
  exports: [
    // ...fromContainers.containers,
    // MaterialModule,
    // ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
