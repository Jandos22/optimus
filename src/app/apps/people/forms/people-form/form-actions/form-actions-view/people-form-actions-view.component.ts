import { Component, Input, Output, EventEmitter } from '@angular/core';

// interfaces
import { FormMode } from '../../../../../../shared/interface/form.model';

// ngrx
import { Store } from '@ngrx/store';
import * as fromPeople from '../../../../store';

@Component({
  selector: 'app-people-form-actions-view',
  styleUrls: ['people-form-actions-view.component.scss'],
  template: `
    <button mat-button tabindex="-1"
      (click)="switchFormMode.emit('edit')">
      EDIT
    </button>

    <button mat-button tabindex="-1"
      (click)="closeUserForm.emit()"
      class="people-form__btn--cancel">
      CLOSE
    </button>
    `
})
export class PeopleFormActionsViewComponent {
  @Output() switchFormMode = new EventEmitter<FormMode>();
  @Output() closeUserForm = new EventEmitter();
  constructor(private store: Store<fromPeople.PeopleState>) {}
}
