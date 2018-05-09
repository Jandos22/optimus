import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/Store';

import * as fromPeople from '../../store';

@Component({
  selector: 'app-people-search',
  styleUrls: ['people-search.component.css'],
  template: `
    <span [formGroup]="parent" class="search__form">
        <mat-form-field [floatLabel]="'never'" [color]="primary">
            <input matInput
                placeholder="Search"
                formControlName="query"
                autocomplete="off">
        </mat-form-field>
    </span>
    `
})
export class PeopleSearchComponent {
  @Input() parent: FormGroup;
  constructor() {}
}
