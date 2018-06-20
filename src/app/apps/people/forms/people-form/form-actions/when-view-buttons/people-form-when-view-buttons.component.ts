import { Component, Input, Output, EventEmitter } from '@angular/core';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

// ngrx
import { Store } from '@ngrx/store';
import * as fromPeople from '../../../../store';

@Component({
  selector: 'app-people-form-when-view-buttons',
  styleUrls: ['people-form-when-view-buttons.component.scss'],
  template: `
    <button mat-button tabindex="-1"
      (click)="switchFormMode.emit('edit')">
      EDIT
    </button>

    <button mat-button tabindex="-1"
      (click)="onCancel()"
      class="people-form__btn--cancel">
      CANCEL
    </button>
    `
})
export class PeopleFormWhenViewButtonsComponent {
  @Output() switchFormMode = new EventEmitter<FormMode>();
  constructor(private store: Store<fromPeople.PeopleState>) {}

  onCancel() {}
}
