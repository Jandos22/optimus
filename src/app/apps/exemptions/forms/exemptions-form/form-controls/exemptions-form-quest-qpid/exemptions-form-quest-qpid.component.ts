import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-exemptions-form-quest-qpid',
  styleUrls: ['exemptions-form-quest-qpid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input matInput placeholder="QUEST QPID" formControlName="QuestQPID" autocomplete="off">

      <button
        mat-icon-button
        matTooltip='Open QUEST Exemption'
        matSuffix
        *ngIf="this.fg_fields.controls['QuestQPID'].value && !this.fg_fields.controls['QuestQPID'].errors"
        (click)="openQuest()">
        <span class='fa_regular'><fa-icon [icon]="['fas', 'link']"></fa-icon></span>
      </button>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class ExemptionsFormQuestQpidComponent {
  @Input() fg_fields: FormGroup;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('QuestQPID').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['QuestQPID'];

    const min = control.hasError('minlength');
    const max = control.hasError('maxlength');
    const onlyNumbers = control.hasError('onlyNumbers');

    return control.touched
      ? onlyNumbers
        ? 'Only numbers allowed'
        : min
          ? '6 digits minimum'
          : max
            ? '6 digits maximum'
            : ''
      : '';
  }

  openQuest() {
    const qpid = this.fg_fields.controls['QuestQPID'].value;
    if (qpid) {
      window.open(
        `https://quest.slb.com/quest/Exemption/ExemptionVIEW.asp?QID=${qpid}&QPID=${qpid}`,
        '_blank'
      );
    }
  }
}
