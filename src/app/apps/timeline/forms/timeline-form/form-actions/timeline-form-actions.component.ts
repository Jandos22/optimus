import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromTimeline from '../../../store';

// rxjs
import { take } from 'rxjs/operators';

// material
import { MatDialog } from '@angular/material';

// services
import { TimelineService } from './../../../services/timeline.service';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// entry components
import {
  DeleteListItemComponent,
  DeleteListItemRetryComponent
} from '../../../../../shared/components';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { TimelineEventItem } from '../../../../../shared/interface/timeline.model';
import { PeopleItem } from '../../../../people/models/people-item.model';

@Component({
  selector: 'app-timeline-form-actions',
  styleUrls: ['timeline-form-actions.component.scss'],
  template: `
    <app-timeline-form-actions-view
      *ngIf="mode === 'view'"
      class="form-actions-view"
      fxLayout="row nowrap"
      fxLayoutAlign="end center"
      (closeForm)="closeForm.emit()"
      (switchFormMode)="switchFormMode.emit($event)"
      (deleteItem)="onDelete()">
    </app-timeline-form-actions-view>

    <app-timeline-form-actions-new
        *ngIf="mode === 'new'"
        fxLayout="row nowrap"
        fxLayoutAlign="end center"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields"
        [fg_image]="fg_image"
        [selfUser]="selfUser">
    </app-timeline-form-actions-new>

    <app-timeline-form-actions-edit
        *ngIf="mode === 'edit'"
        fxLayout="row nowrap"
        fxLayoutAlign="end center"
        [fg_fields]="fg_fields"
        [fg_image]="fg_image"
        [initialFields]="initialFields"
        [selfUser]="selfUser"
        (switchFormMode)="switchFormMode.emit($event)"
        (updateDataItem)="updateDataItem.emit($event)"
        (updateDataItemImage)="updateDataItemImage.emit($event)">
    </app-timeline-form-actions-edit>
    `
})
export class TimelineFormActionsComponent {
  @Input()
  mode: FormMode;

  @Input()
  fg_fields: FormGroup;

  @Input()
  fg_image: FormGroup;

  @Input()
  initialFields: TimelineEventItem;

  @Input()
  selfUser?: PeopleItem;

  @Output()
  switchFormMode = new EventEmitter<any>();

  @Output()
  closeForm = new EventEmitter<any>();

  // triggered after saving fields and/or image
  @Output()
  updateDataItem = new EventEmitter<TimelineEventItem>();

  @Output()
  updateDataItemImage = new EventEmitter<SpListItemAttachmentFiles[]>();

  constructor(
    private store_harcs: Store<fromTimeline.TimelineState>,
    private srv: TimelineService,
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
              new fromTimeline.DeleteOne(this.initialFields.Id)
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
              new fromTimeline.DeleteOne(this.initialFields.Id)
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
