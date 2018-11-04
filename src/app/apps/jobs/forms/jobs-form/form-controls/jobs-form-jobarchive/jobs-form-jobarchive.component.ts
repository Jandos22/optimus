import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-jobs-form-jobarchive',
  styleUrls: ['jobs-form-jobarchive.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">

      <input
        matInput
        placeholder="Job Archive (Link)"
        formControlName="Url"
        autocomplete="off">

      <button
        mat-icon-button
        matTooltip='open Job Archive (only Internet Explorer)'
        matSuffix
        *ngIf="this.fg_fields.controls['Url'].value && !this.fg_fields.controls['Url'].errors"
        (click)="openJobArchive()">
        <span class='fa_regular'><fa-icon [icon]="['fas', 'folder']"></fa-icon></span>
      </button>

    </mat-form-field>
  `
})
export class JobsFormJobArchiveComponent {
  @Input()
  fg_fields: FormGroup;

  @Input()
  mode: FormMode;

  constructor() {}

  openJobArchive() {
    const url = this.fg_fields.controls['Url'].value;
    if (url) {
      window.open(`${url}`, '_blank');
    }
  }

  get hasError() {
    console.log(this.fg_fields);
    return this.fg_fields.get('Url').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.get('Url');

    const required = control.hasError('required');

    return control.touched ? (required ? '... is required' : '') : '';
  }
}
