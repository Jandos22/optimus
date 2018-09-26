import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-toolbar',
  styleUrls: ['people-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-progress-bar *ngIf="searching"
      class="common-searching-indicator" color="primary" mode="indeterminate">
    </mat-progress-bar>

    <app-people-toolbar-button-menu class="common-toolbar-item">
    </app-people-toolbar-button-menu>

    <app-people-toolbar-input-search
      fxFlex
      [appName]="appName"
      [fg_params]="fg_params"
      (onFocus)="onFocus.emit()"
      (onBlur)="onBlur.emit()">
    </app-people-toolbar-input-search>

    <app-people-toolbar-button-clear
      *ngIf="fg_params.get('text').value"
      [fg_params]="fg_params">
    </app-people-toolbar-button-clear>

    <app-people-toolbar-button-add
      *ngIf="canCreate()"
      matTooltip="Add new User/Employee"
      (openForm)="openForm.emit()">
    </app-people-toolbar-button-add>

    <app-toolbar-button-filters
      (toggleFilters)="toggleFilters.emit()">
    </app-toolbar-button-filters>
    `
})
export class PeopleToolbarComponent {
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
