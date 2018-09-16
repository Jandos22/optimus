import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-timeline-toolbar',
  styleUrls: ['timeline-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-progress-bar *ngIf="searching"
      class="common-searching-indicator" color="primary" mode="indeterminate">
    </mat-progress-bar>

    <app-timeline-toolbar-button-menu class="common-toolbar-item">
    </app-timeline-toolbar-button-menu>

    <app-timeline-toolbar-input-search
      fxFlex
      [appName]="appName"
      [fg_params]="fg_params"
      (onFocus)="onFocus.emit()"
      (onBlur)="onBlur.emit()">
    </app-timeline-toolbar-input-search>

    <app-timeline-toolbar-button-clear
        *ngIf="fg_params.get('text').value"
        [fg_params]="fg_params">
    </app-timeline-toolbar-button-clear>

    <app-timeline-toolbar-button-add
      *ngIf="canCreate()"
      matTooltip="Post new event"
      (openForm)="openForm.emit()">
    </app-timeline-toolbar-button-add>

    <app-toolbar-button-filters
      (toggleFilters)="toggleFilters.emit()">
    </app-toolbar-button-filters>
    `
})
export class TimelineToolbarComponent {
  @Input()
  appName: string;

  @Input()
  searching: boolean;

  @Input()
  fg_params: FormGroup;

  @Input()
  accessLevel: number;

  @Output()
  openForm = new EventEmitter<any>();

  @Output()
  toggleFilters = new EventEmitter<any>();

  @Output()
  onFocus = new EventEmitter<any>();

  @Output()
  onBlur = new EventEmitter<any>();

  constructor() {}

  onClear() {
    this.fg_params.reset();
  }

  canCreate() {
    if (this.accessLevel) {
      return this.accessLevel >= 3 ? true : false;
    } else {
      return false;
    }
  }
}
