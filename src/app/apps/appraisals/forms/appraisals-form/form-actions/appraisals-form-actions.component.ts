import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromAppraisals from '../../../store';

// rxjs
import { take } from 'rxjs/operators';

// material
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { AppraisalItem } from '../../../../../shared/interface/appraisals.model';
import { AppraisalRights } from './../../../store/effects/rights.effects';

// dialog box
import {
  DeleteListItemComponent,
  DeleteListItemRetryComponent
} from '../../../../../shared/components';
import { AppraisalsService } from '../../../services';

@Component({
  selector: 'app-appraisals-form-actions',
  styleUrls: ['appraisals-form-actions.component.scss'],
  template: `
    <app-appraisals-form-actions-view
      *ngIf="mode === 'view'"
      [position]="position" [isAppraisalAuthor]="isAppraisalAuthor"
      (closeForm)="closeForm.emit()" (deleteItem)="onDelete()"
      (switchFormMode)="switchFormMode.emit($event)"
      fxLayout="row nowrap" fxLayoutAlign="end center"
      class="form-actions-view">
    </app-appraisals-form-actions-view>

    <app-appraisals-form-actions-new
        *ngIf="mode === 'new'"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields"
        class="form-actions-new"
        fxLayout="row nowrap" fxLayoutAlign="end center">
    </app-appraisals-form-actions-new>

    <app-appraisals-form-actions-edit
        *ngIf="mode === 'edit'"
        [fg_fields]="fg_fields"
        [initialFields]="initialFields"
        (switchFormMode)="switchFormMode.emit($event)"
        (updateDataItem)="updateDataItem.emit($event)"
        class="form-actions-edit"
        fxLayout="row nowrap" fxLayoutAlign="end center">
    </app-appraisals-form-actions-edit>
    `
})
export class AppraisalsFormActionsComponent {
  @Input()
  mode: FormMode;
  @Input()
  fg_fields: FormGroup;
  @Input()
  initialFields: AppraisalItem;
  @Input()
  position: AppraisalRights;
  @Input()
  isAppraisalAuthor: boolean;

  @Output()
  switchFormMode = new EventEmitter<any>();
  @Output()
  closeForm = new EventEmitter<any>();

  // triggered after saving fields and/or image
  @Output()
  updateDataItem = new EventEmitter<AppraisalItem>();

  constructor(
    private store_appraisals: Store<fromAppraisals.AppraisalsState>,
    public deleteDialog: MatDialog,
    public retryDeleteDialog: MatDialog,
    private srv: AppraisalsService
  ) {}

  onDelete(): void {
    const dialogRef = this.deleteDialog.open(DeleteListItemComponent);

    dialogRef.afterClosed().subscribe(result => {
      // if true, then delete list item
      if (result) {
        const delete$ = this.srv.deleteItemById(this.initialFields.Id);
        delete$.pipe(take(1)).subscribe(
          deleted => {
            console.log('deleted');
            console.log(deleted);
            this.store_appraisals.dispatch(
              new fromAppraisals.DeleteOneAppraisal(this.initialFields.Id)
            );
            this.closeForm.emit();
          },
          error => {
            console.log('could not delete');
            console.log(error);
            this.onRetryDelete();
          }
        );
      } else {
        console.log('do nothing');
      }
    });
  }

  onRetryDelete(): void {
    const dialogRef = this.deleteDialog.open(DeleteListItemRetryComponent);

    dialogRef.afterClosed().subscribe(result => {
      // if true, then delete list item
      if (result) {
        const delete$ = this.srv.deleteItemById(this.initialFields.Id);
        delete$.pipe(take(1)).subscribe(
          deleted => {
            console.log('deleted');
            console.log(deleted);
            this.store_appraisals.dispatch(
              new fromAppraisals.DeleteOneAppraisal(this.initialFields.Id)
            );
            this.closeForm.emit();
          },
          error => {
            console.log('could not delete');
            console.log(error);
            this.onRetryDelete();
          }
        );
      } else {
        console.log('do nothing');
      }
    });
  }
}
