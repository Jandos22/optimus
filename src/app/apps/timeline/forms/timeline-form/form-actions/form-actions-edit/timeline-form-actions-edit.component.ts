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

import * as _ from 'lodash';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../store';
import * as fromTimeline from '../../../../store';

// ngrx actions
import * as fromErrorActions from '../../../../../../store/actions/errors.actions';
import * as fromEventsActions from '../../../../store/actions/events.actions';

// services
import { TimelineFormHttpService } from '../../form-services/timeline-form-http.service';
import { SpListItemAttachmentFile } from '../../../../../../shared/interface/sp-list-item.model';

// interfaces
import {
  TimelineEventItem,
  ToSaveEventImage
} from '../../../../../../shared/interface/timeline.model';
import { PeopleItem } from '../../../../../people/models/people-item.model';

@Component({
  selector: 'app-timeline-form-actions-edit',
  styleUrls: ['timeline-form-actions-edit.component.scss'],
  template: `
    <!-- <button mat-button color="warn" (click)="log()">LOG</button> -->

    <button mat-button color="primary" tabindex="-1"
      [disabled]="!fg_fields.valid || (!hasUnsavedFields && !hasUnsavedImage) || savingChanges"
      [ngClass]="{ 'mat-button__fa-icon': savingChanges }"
      (click)="onSave()">
      <span *ngIf="!savingChanges">SAVE</span>
      <span *ngIf="savingChanges">SAVING </span>
      <fa-icon *ngIf="savingChanges" [icon]="['fas', 'spinner']" [spin]="true" matTooltip="Saving changes"></fa-icon>
    </button>

    <button mat-button tabindex="-1"
      (click)="switchFormMode.emit('view')">
      CANCEL
    </button>

    <app-timeline-form-actions-edit-fields
      [fg_fields]="fg_fields" [initialFields]="initialFields"
      (whenUnsavedFieldsChange)="unsavedFieldsChange($event)">
    </app-timeline-form-actions-edit-fields>
    `
})
export class TimelineFormActionsEditComponent implements OnInit, OnDestroy {
  @Input()
  fg_fields: FormGroup;

  @Input()
  fg_image: FormGroup;

  @Input()
  initialFields: TimelineEventItem;

  @Input()
  selfUser?: PeopleItem;

  @Output()
  closeForm = new EventEmitter<any>();

  @Output()
  switchFormMode = new EventEmitter<any>();

  @Output()
  updateDataItem = new EventEmitter<TimelineEventItem>();

  @Output()
  updateDataItemImage = new EventEmitter<SpListItemAttachmentFile[]>();

  // activates spinner
  savingChanges = false;

  // toggles save button
  hasUnsavedFields = false;
  hasUnsavedImage = false;

  // collector
  unsavedFields = {}; // start with empty object

  // subscriptions
  // $saveChangesFields: Subscription;
  // $saveChangesImage: Subscription;
  $watchArrayBuffer: Subscription;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_timeline: Store<fromTimeline.TimelineState>,
    private spHttp: TimelineFormHttpService
  ) {
    console.log('timeline-form-actions-edit: initialized');
  }

  ngOnInit() {
    this.$watchArrayBuffer = this.fg_image
      .get('ArrayBuffer')
      .valueChanges.subscribe(arrayBuffer =>
        this.onArrayBufferChange(arrayBuffer)
      );
  }

  ngOnDestroy() {
    this.$watchArrayBuffer.unsubscribe();
    // this.$saveChangesFields.unsubscribe();
    // this.$saveChangesImage.unsubscribe();
  }

  // form has unsaved image when ArrayBuffer is not 0
  onArrayBufferChange(arrayBuffer: ArrayBuffer) {
    arrayBuffer.byteLength
      ? (this.hasUnsavedImage = true)
      : (this.hasUnsavedImage = false);
  }

  // triggered from child component
  unsavedFieldsChange(unsavedFields: Object) {
    this.hasUnsavedFields = _.size(unsavedFields) ? true : false;
    this.unsavedFields = { ...unsavedFields };

    console.log('unsaved fields changed:');
    console.log(this.unsavedFields);
  }

  // SAVE button
  onSave() {
    this.savingChanges = true;

    // (1) first save unsaved fields
    if (this.hasUnsavedFields) {
      this.saveFields(this.unsavedFields);

      // (2) if no unsaved fields, but have unsaved image
    } else if (this.hasUnsavedImage) {
      this.saveImage(this.fg_image.value);

      // (3) if no fields nor image to save then do nothing
    } else {
      console.log('nothing to save, buddy!');
    }
  }

  saveFields(newFields: TimelineEventItem) {
    console.log('starting to save fields:');
    console.log(newFields);

    if (_.has(newFields, 'FollowUp') === true) {
      // add last FollowUpBy info
      newFields = {
        ...newFields,
        FollowUpById: this.selfUser.Id,
        LastFollowUp: new Date(Date.now())
      };
    }

    this.spHttp
      .updateItem(newFields)
      .pipe(take(1)) // subscription will auto unsubscribe
      .subscribe(
        success => this.saveFieldsSuccess(success as TimelineEventItem),
        error => this.saveFieldsError(error),
        () => console.log('completed updating list item')
      );
  }

  saveFieldsSuccess(updatedItem: TimelineEventItem) {
    console.log('successfully saved fields:');
    console.log(updatedItem);

    // empty out unsaved fields since you saved them just now
    this.unsavedFields = {};
    this.hasUnsavedFields = false;

    this.getAllFieldsOfUpdatedItem(updatedItem);
  }

  getAllFieldsOfUpdatedItem(updatedItem: TimelineEventItem) {
    console.log('getting all fields of updated item:');

    this.spHttp
      .getItemById(updatedItem.ID)
      .pipe(take(1))
      .subscribe(
        success =>
          this.getAllFieldsOfUpdatedItemSuccees(
            success[0] as TimelineEventItem
          ),
        error => this.getAllFieldsOfUpdatedItemError(error),
        () => console.log('completed getting all fields of updated item')
      );
  }

  getAllFieldsOfUpdatedItemSuccees(fullItem: TimelineEventItem) {
    console.log('successfully got all fields of updated item:');
    console.log(fullItem);

    // now you want to update data.item
    // in case user will want to hit EDIT button again
    this.updateDataItem.emit(fullItem);

    // update item entity in state
    this.store_timeline.dispatch(
      new fromEventsActions.UpdateOneEvent(fullItem.ID, fullItem)
    );

    // function that checks if anything left to save
    // if yes, it will run save workflows
    // if not, then switch mode to view
    this.finalize();
  }

  getAllFieldsOfUpdatedItemError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  saveFieldsError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  saveImage(image: ToSaveEventImage) {
    this.spHttp
      .saveImage(image)
      .pipe(take(1)) // auto unsubscribe()
      .subscribe(
        success => this.saveImageSuccess(success),
        error => this.saveImageError(error),
        () => console.log('completed saving image')
      );
  }

  saveImageSuccess(newImage) {
    console.log('successfully saved image:');
    console.log(newImage);

    this.hasUnsavedImage = false;

    newImage = this.escapeCachedImage(newImage);

    console.log('update data item image with this');
    console.log(newImage);

    this.updateDataItemImage.emit(newImage);

    const changes: TimelineEventItem = {
      Attachments: true,
      AttachmentFiles: {
        results: newImage
      }
    };

    this.store_timeline.dispatch(
      new fromEventsActions.UpdateOneEvent(this.initialFields.ID, changes)
    );

    this.finalize();
  }

  saveImageError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  escapeCachedImage(newImage: SpListItemAttachmentFile[]) {
    // time is added to url to push browser to show updated image
    const url = newImage[0].ServerRelativeUrl + '?time=' + Date.now();

    return [
      { ...newImage[0], ServerRelativeUrl: url }
    ] as SpListItemAttachmentFile[];
  }

  finalize() {
    // if form has unsaved image then upload it
    if (this.hasUnsavedImage) {
      this.savingChanges = true;
      this.saveImage(this.fg_image.value);
    } else {
      // when everything save, switch to view mode
      console.log('completed saving everything:');
      this.savingChanges = false;
      this.switchFormMode.emit('view');
    }
  }

  log() {
    console.log(this.fg_fields.getRawValue());
    console.log(this.fg_image.value);
  }
}
