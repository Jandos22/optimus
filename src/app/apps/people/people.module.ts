import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PeopleComponent } from './people.component';

export const peopleRoutes: Routes = [
  { path: '', component: PeopleComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(peopleRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [PeopleComponent]
})
export class PeopleModule { }
