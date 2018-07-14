import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-control-quest-rir',
  styleUrls: ['form-control-quest-rir.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input matInput placeholder="QUEST RIR" formControlName="QuestRIR" autocomplete="off">
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class FormControlQuestRirComponent {
  @Input() fg_fields: FormGroup;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('QuestRIR').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['QuestRIR'];

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
