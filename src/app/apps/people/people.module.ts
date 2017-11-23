import { ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from './../../shared/libraries/material-design.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PeopleComponent } from './people.component';
import { reducer } from './store/people.reducer';
import { PeopleEffects } from './store/people.effects';
import { PeopleToolbarComponent } from './people-toolbar/people-toolbar.component';
import { PeopleListComponent } from './people-list/people-list.component';

export const peopleRoutes: Routes = [
  { path: '', component: PeopleComponent},
];

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    RouterModule.forChild(peopleRoutes),
    StoreModule.forFeature('people', reducer),
    EffectsModule.forFeature([PeopleEffects])
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
    PeopleComponent,
    PeopleToolbarComponent,
    PeopleListComponent
  ]
})
export class PeopleModule { }
