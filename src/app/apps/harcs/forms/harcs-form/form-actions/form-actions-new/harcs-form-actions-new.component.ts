import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../store';
import * as fromHarcs from '../../../../store';

// ngrx actions
import * as fromErrorActions from '../../../../../../store/actions/errors.actions';
import * as fromHarcsActions from '../../../../store/actions/harcs.actions';

// interfaces
import { HarcItem } from '../../../../../../shared/interface/harcs.model';

// services
import { HarcsFormHttpService } from '../../form-services/harcs-form-http.service';

@Component({
  selector: 'app-harcs-form-actions-new',
  styleUrls: ['harcs-form-actions-new.component.scss'],
  template: `
    <!-- <button mat-button color="primary" (click)="log()">LOG</button> -->

    <button mat-button color="primary"
      [disabled]="!fg_fields.valid || savingChanges"
      (click)="onSave()">
      <span *ngIf="!savingChanges">SAVE</span>
      <span *ngIf="savingChanges">SAVING </span>
      <fa-icon *ngIf="savingChanges" [icon]="['fas', 'spinner']" [spin]="true" matTooltip="Saving changes"></fa-icon>
    </button>

    <button mat-button tabindex="-1"
      (click)="closeForm.emit()">
      CANCEL
    </button>
    `
})
export class HarcsFormActionsNewComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;

  @Output() closeForm = new EventEmitter<any>();

  // activates spinner
  savingChanges = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_harcs: Store<fromHarcs.HarcsState>,
    private spHttp: HarcsFormHttpService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  onSave() {
    this.savingChanges = true;
    this.saveFields(this.fg_fields.getRawValue());
  }

  saveFields(newFields: HarcItem) {
    this.spHttp
      .createHarc(newFields)
      .pipe(take(1))
      .subscribe(
        success => this.saveFieldsSuccess(success as HarcItem),
        error => this.saveFieldsError(error),
        () => console.log('completed adding new user')
      );
  }

  saveFieldsSuccess(newHarc: HarcItem) {
    // add newly created user to users store
    // update fg_photo by adding ID of created user
    // check if form has unsaved photo and upload it
    // if no unsaved photo, then close form
    console.log('get new harc');
    console.log(newHarc);
    this.spHttp
      .getItemById(newHarc.ID)
      .pipe(take(1))
      .subscribe(
        success => this.getNewlyCreatedItemSuccess(success as HarcItem[]),
        error => console.log(error),
        () => console.log('completed getting newly created item')
      );
  }

  getNewlyCreatedItemSuccess(newItemExpanded: HarcItem[]) {
    console.log('get new item expanded');
    console.log(newItemExpanded);
    this.store_harcs.dispatch(
      new fromHarcsActions.InsertOneHarc({
        ...newItemExpanded[0],
        id: newItemExpanded[0].ID
      })
    );
    this.finalize();
  }

  saveFieldsError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  finalize() {
    console.log(this.fg_fields.value);
    this.savingChanges = false;
    this.closeForm.emit({
      result: 'success',
      data: this.fg_fields.value
    });
  }

  log() {
    console.log(this.fg_fields.getRawValue());
  }
}
