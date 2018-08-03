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
import * as fromAppraisals from '../../../../store';

// ngrx actions
import * as fromErrorActions from '../../../../../../store/actions/errors.actions';
import * as fromAppraisalsActions from '../../../../store/actions/appraisals.actions';

// interfaces
import { AppraisalItem } from '../../../../../../shared/interface/appraisals.model';

// services
import { AppraisalsFormHttpService } from '../../form-services/appraisals-form-http.service';

@Component({
  selector: 'app-appraisals-form-actions-new',
  styleUrls: ['appraisals-form-actions-new.component.scss'],
  template: `
    <button mat-button color="primary" (click)="log()">LOG</button>

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
export class AppraisalsFormActionsNewComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;

  @Output() closeForm = new EventEmitter<any>();

  // activates spinner
  savingChanges = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_appraisals: Store<fromAppraisals.AppraisalsState>,
    private spHttp: AppraisalsFormHttpService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  onSave() {
    this.savingChanges = true;
    this.saveFields(this.fg_fields.getRawValue());
  }

  saveFields(newFields: AppraisalItem) {
    this.spHttp
      .createAppraisal(newFields)
      .pipe(take(1))
      .subscribe(
        success => this.saveFieldsSuccess(success as AppraisalItem),
        error => this.saveFieldsError(error),
        () => console.log('completed adding new appraisal')
      );
  }

  saveFieldsSuccess(newAppraisal: AppraisalItem) {
    // add newly created appraisal to appraisals store
    console.log('get new appraisal');
    console.log(newAppraisal);
    this.spHttp
      .getItemById(newAppraisal.ID)
      .pipe(take(1))
      .subscribe(
        success => this.getNewlyCreatedItemSuccess(success as AppraisalItem[]),
        error => console.log(error),
        () => console.log('completed getting newly created item')
      );
  }

  getNewlyCreatedItemSuccess(newItemExpanded: AppraisalItem[]) {
    console.log('get new item expanded');
    console.log(newItemExpanded);
    this.store_appraisals.dispatch(
      new fromAppraisalsActions.InsertOneAppraisal({
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
    console.log(this.fg_fields);
    console.log(this.fg_fields.getRawValue());
  }
}
