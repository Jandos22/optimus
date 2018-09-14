import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromHarcs from '../../../store';

// rxjs
import { take } from 'rxjs/operators';

// material
import { MatDialog } from '@angular/material';

// services
import { HarcsService } from '../../../services';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { HarcItem } from '../../../../../shared/interface/harcs.model';

// entry components
import {
  DeleteListItemComponent,
  DeleteListItemRetryComponent
} from '../../../../../shared/components';

@Component({
  selector: 'app-harcs-form-actions',
  styleUrls: ['harcs-form-actions.component.scss'],
  template: `
    <app-harcs-form-actions-view
      *ngIf="mode === 'view'"
      class="form-actions-view"
      fxLayout="row nowrap"
      fxLayoutAlign="end center"
      (closeForm)="closeForm.emit()"
      (deleteItem)="onDelete()"
      (switchFormMode)="switchFormMode.emit($event)">
    </app-harcs-form-actions-view>

    <app-harcs-form-actions-new
        *ngIf="mode === 'new'"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields">
    </app-harcs-form-actions-new>

    <app-harcs-form-actions-edit
        *ngIf="mode === 'edit'"
        [fg_fields]="fg_fields"
        [initialFields]="initialFields"
        (switchFormMode)="switchFormMode.emit($event)"
        (updateDataItem)="updateDataItem.emit($event)">
    </app-harcs-form-actions-edit>
    `
})
export class HarcsFormActionsComponent {
  @Input()
  mode: FormMode;

  @Input()
  fg_fields: FormGroup;

  @Input()
  initialFields: HarcItem;

  @Output()
  switchFormMode = new EventEmitter<any>();

  @Output()
  closeForm = new EventEmitter<any>();

  // triggered after saving fields and/or image
  @Output()
  updateDataItem = new EventEmitter<HarcItem>();

  constructor(
    private store_harcs: Store<fromHarcs.HarcsState>,
    private srv: HarcsService,
    public deleteDialog: MatDialog,
    public retryDeleteDialog: MatDialog
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
            this.store_harcs.dispatch(
              new fromHarcs.DeleteOne(this.initialFields.Id)
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
            this.store_harcs.dispatch(
              new fromHarcs.DeleteOne(this.initialFields.Id)
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
