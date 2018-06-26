import { Component, Input } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromPeople from '../../../../store';

@Component({
  selector: 'app-people-form-when-new-buttons',
  styleUrls: ['people-form-when-new-buttons.component.scss'],
  template: `
    <button mat-button tabindex="-1"
      (click)="onSave()">

      <!-- two span els needed to have right vertical alignment -->
      <span *ngIf="($spinner | async).onSaving" class="g_form-button__text">
        <fa-icon [icon]="['fas', 'spinner']" [spin]="true"></fa-icon>
      </span>

      <span class="g_form-button__text">SAVE</span>
    </button>

    <button mat-button tabindex="-1"
      (click)="onCancel()">
      CANCEL
    </button>
    `
})
export class PeopleFormWhenNewButtonsComponent {
  $spinner: Observable<{ onSaving: boolean; onSavingChanges: boolean }>;

  constructor(private store: Store<fromPeople.PeopleState>) {
    // this.$spinner = this.store.pipe(select(fromPeople.selectSpinner));
  }

  onEdit() {
    // this.store.dispatch(new a_in_form.UpdateFormMode('edit'));
  }

  onSave() {}

  onCancel() {}
}
