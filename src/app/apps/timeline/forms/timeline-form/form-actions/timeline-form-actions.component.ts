import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { TimelineEventItem } from '../../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-form-actions',
  styleUrls: ['timeline-form-actions.component.scss'],
  template: `
    <app-timeline-form-actions-view
      *ngIf="mode === 'view'"
      (closeForm)="closeForm.emit()"
      (switchFormMode)="switchFormMode.emit($event)">
    </app-timeline-form-actions-view>

    <app-timeline-form-actions-new
        *ngIf="mode === 'new'"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields"
        [fg_image]="fg_image">
    </app-timeline-form-actions-new>

    <app-timeline-form-actions-edit
        *ngIf="mode === 'edit'"
        [fg_fields]="fg_fields"
        [fg_image]="fg_image"
        [initialFields]="initialFields"
        (switchFormMode)="switchFormMode.emit($event)"
        (updateDataItem)="updateDataItem.emit($event)"
        (updateDataItemImage)="updateDataItemImage.emit($event)">
    </app-timeline-form-actions-edit>
    `
})
export class TimelineFormActionsComponent {
  @Input() mode: FormMode;
  @Input() fg_fields: FormGroup;
  @Input() fg_image: FormGroup;
  @Input() initialFields: TimelineEventItem;

  @Output() switchFormMode = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<any>();

  // triggered after saving fields and/or image
  @Output() updateDataItem = new EventEmitter<TimelineEventItem>();
  @Output()
  updateDataItemImage = new EventEmitter<SpListItemAttachmentFiles[]>();

  constructor() {}
}
