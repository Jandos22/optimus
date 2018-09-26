import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-control-quest-qpid',
  styleUrls: ['form-control-quest-qpid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input matInput placeholder="QUEST QPID" formControlName="QuestQPID" autocomplete="off">

      <button
        mat-icon-button
        matTooltip='Open QUEST RIR'
        matSuffix
        *ngIf="this.fg_fields.controls['QuestQPID'].value && !this.fg_fields.controls['QuestQPID'].errors"
        (click)="openQuestRIR()">
        <span class='fa_regular'><fa-icon [icon]="['fas', 'link']"></fa-icon></span>
      </button>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class FormControlQuestQpidComponent {
  @Input()
  fg_fields: FormGroup;

  @Input()
  type: string;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('QuestQPID').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['QuestQPID'];

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

  openQuestRIR() {
    const qpid = this.fg_fields.controls['QuestQPID'].value;

    const meeting =
      this.type === 'SQ Meeting' || this.type === 'SET Meeting' ? true : false;

    if (qpid && meeting) {
      window.open(
        `https://quest.slb.com/quest/Meeting/Meetingview.asp?QPID=${qpid}`,
        '_blank'
      );
    }

    if (qpid && !meeting) {
      window.open(
        `https://quest.slb.com/quest/RIR/RIRview.asp?QPID=${qpid}`,
        '_blank'
      );
    }
  }
}
