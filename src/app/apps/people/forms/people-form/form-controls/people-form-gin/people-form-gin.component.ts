import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-gin',
  styleUrls: ['people-form-gin.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="parent" fxFlex class="my-form-field_container">
        <mat-form-field fxFlexFill>
            <input matInput placeholder="Gin" formControlName="Gin" autocomplete="off">
            <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormGinComponent {
  @Input() parent: FormGroup;

  constructor() {}

  get hasError() {
    return this.parent.get('Gin').invalid;
  }

  get errorMessage() {
    const control = this.parent.controls['Gin'];

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
          : min || max
            ? '8 digits required'
            : unique
              ? '... is already registered'
              : ''
      : '';
  }
}
