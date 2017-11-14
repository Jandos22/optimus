import { MaterialDesignModule } from './../../shared/libraries/material-design.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PeopleComponent } from './people.component';
import { reducer } from './store/people.reducer';
// import { reducers } from './store/reducers';
import { PeopleEffects } from './store/people.effects';

export const peopleRoutes: Routes = [
  { path: ':location', component: PeopleComponent},
  { path: '', component: PeopleComponent},
];

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    RouterModule.forChild(peopleRoutes),
    StoreModule.forFeature('people', reducer),
    EffectsModule.forFeature([PeopleEffects])
  ],
  exports: [
    RouterModule,
  ],
  declarations: [PeopleComponent]
})
export class PeopleModule { }
