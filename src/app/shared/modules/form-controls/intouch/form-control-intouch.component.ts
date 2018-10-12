import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-control-intouch',
  styleUrls: ['form-control-intouch.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input matInput placeholder="InTouch" formControlName="InTouch" autocomplete="off">

      <button
        mat-icon-button
        matTooltip='Open InTouch Page'
        matSuffix
        *ngIf="this.fg_fields.controls['InTouch'].value && !this.fg_fields.controls['InTouch'].errors"
        (click)="openInTouch()">
        <span class='fa_regular'><fa-icon [icon]="['fas', 'link']"></fa-icon></span>
      </button>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class FormControlInTouchComponent {
  @Input()
  fg_fields: FormGroup;

  @Input()
  type: string;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('InTouch').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['InTouch'];

    const required = control.hasError('required');
    const min = control.hasError('minlength');
    const max = control.hasError('maxlength');
    const onlyNumbers = control.hasError('onlyNumbers');
    const unique = control.hasError('unique');

    return control.touched
      ? required
        ? '... number is required'
        : onlyNumbers
          ? 'Only numbers allowed'
          : min
            ? '6 digits minimum'
            : max
              ? '8 digits maximum'
              : ''
      : '';
  }

  openInTouch() {
    const number = this.fg_fields.controls['InTouch'].value;

    const issue =
      this.type === 'Note' || this.type === 'Issue' || this.type === 'Failure'
        ? true
        : false;

    if (number && issue) {
      window.open(
        `https://intouchsupport.com/index.cfm?event=content.preview&contentid=${number}`,
        '_blank'
      );
    }
  }
}
