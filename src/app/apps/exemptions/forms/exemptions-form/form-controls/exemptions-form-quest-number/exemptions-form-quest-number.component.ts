import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-exemptions-form-quest-number',
  styleUrls: ['exemptions-form-quest-number.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input matInput placeholder="QUEST Number" formControlName="QuestNumber" autocomplete="off">
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class ExemptionsFormQuestNumberComponent {
  @Input() fg_fields: FormGroup;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('QuestNumber').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['QuestNumber'];

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
            ? '14 digits required'
            : ''
      : '';
  }
}
