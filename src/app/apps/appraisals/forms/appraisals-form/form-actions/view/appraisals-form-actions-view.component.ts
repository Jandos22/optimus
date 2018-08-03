import { AppraisalRights } from './../../../../store/effects/rights.effects';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-appraisals-form-actions-view',
  styleUrls: ['appraisals-form-actions-view.component.scss'],
  template: `
    <button mat-icon-button tabindex="-1" matTooltip="delete appraisal"
      (click)="deleteItem.emit()" *ngIf="isAppraisalAuthor" class="appraisal-delete-button">
      <span class='fa_regular'><fa-icon [icon]="['far', 'trash-alt']"></fa-icon></span>
    </button>

    <button fxHide.xs="true" mat-button tabindex="-1" color='primary' matTooltip="edit appraisal"
      (click)="switchFormMode.emit('edit')" [disabled]="!position.isFEFS || !isAppraisalAuthor">
      <div>EDIT</div>
    </button>

    <button fxHide.gt-xs="true" mat-icon-button tabindex="-1" color='primary' matTooltip="edit appraisal"
      (click)="switchFormMode.emit('edit')" [disabled]="!position.isFEFS || !isAppraisalAuthor">
      <span class='fa_regular'><fa-icon [icon]="['far', 'edit']"></fa-icon></span>
    </button>

    <button mat-button tabindex="-1"
      (click)="closeForm.emit()">
      CLOSE
    </button>
  `
})
export class AppraisalsFormActionsViewComponent {
  @Input() position: AppraisalRights;
  @Input() isAppraisalAuthor: boolean;

  @Output() switchFormMode = new EventEmitter<FormMode>();
  @Output() closeForm = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();

  constructor() {}
}
