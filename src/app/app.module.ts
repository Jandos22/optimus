
// 3rd Party Modules
import { SidebarModule } from 'ng-sidebar';
import { MaterialDesignModule } from './shared/libraries/material-design.module';
import { PrimengModule } from './shared/libraries/primeng.module';

// My Modules & Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { HeaderComponent } from './layout/header/header.component';

// Angular Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
// import { Routes, RouterModule } from '@angular/router';

import { environment } from './../environments/environment';

// NgRx State Management Modules
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CustomRouterStateSerializer } from './store/router.utilities';
import { reducers, metaReducers } from './store/app.reducers';
import { ApplicationEffects } from './store/application.effects';
import { UserEffects } from './store/user.effects';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    PrimengModule,
    MaterialDesignModule,
    SidebarModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      ApplicationEffects,
      UserEffects
      ]),
    StoreRouterConnectingModule,
    AppRoutingModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer},
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
