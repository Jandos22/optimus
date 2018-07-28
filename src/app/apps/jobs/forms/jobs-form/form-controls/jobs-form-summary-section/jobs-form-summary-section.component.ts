import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-jobs-form-summary-section',
  styleUrls: ['jobs-form-summary-section.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="summary-section-container" fxFlex="100%"
      fxLayout="row wrap" fxLayoutAlign="start start"
      [ngClass]="{ focused: focused, 'hover-delete': hoverDelete }">

      <div class="section-title-view" *ngIf="mode === 'view'">
        {{ fg_fields.controls['JSStitle' + this.sectionNumber].value }}
      </div>

      <mat-form-field [formGroup]="fg_fields" floatLabel="never" *ngIf="mode !== 'view'"
        class="section-title">

        <input tabindex="1"
          matInput (focus)="onFocus()" (blur)="onBlur()"
          [placeholder]="'Enter Summary Title'"
          [formControlName]="'JSStitle' + sectionNumber"
          autocomplete="off">

        <mat-error *ngIf="hasErrorInTitle">{{ errorMessageTitle }}</mat-error>
      </mat-form-field>

      <div class='section-delete' *ngIf="mode !== 'view'">
        <button mat-icon-button matTooltip='Delete Summary Section'
          *ngIf="last"
          tabindex="-1"
          (mouseenter)="onMouseOverDelete()"
          (mouseleave)="onMouseLeaveDelete()"
          (click)="onSectionDelete(sectionNumber)">
          <span class='fa_regular'><fa-icon [icon]="['far', 'trash-alt']"></fa-icon></span>
        </button>
      </div>

      <mat-form-field fxFlex="100%" [formGroup]="fg_fields" floatLabel="never"
        class="section-body">
          <textarea matInput tabindex="2"
            (focus)="onFocus()" (blur)="onBlur()"
            [placeholder]="'Enter Summary Details'"
            [formControlName]="'JSSbody' + sectionNumber"
            cdkTextareaAutosize
            #autosize="cdkTextareaAutosize"
            cdkAutosizeMinRows="2">
          </textarea>
          <mat-hint align="end" *ngIf="mode !== 'view'">
            {{fg_fields.get('JSSbody' + sectionNumber).value?.length }} / 255
          </mat-hint>
          <mat-error *ngIf="hasErrorInBody">{{ errorMessageBody }}</mat-error>
      </mat-form-field>
    </div>

    <!-- Hidden / Used for logic operations -->
    <app-jobs-form-summary-section-dynamic-validation
      [title]="fg_fields.controls['JSStitle' + this.sectionNumber]"
      [body]="fg_fields.controls['JSSbody' + this.sectionNumber]">
    </app-jobs-form-summary-section-dynamic-validation>
  `
})
export class JobsFormSummarySectionComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;
  @Input() sectionNumber: number;
  @Input() last: number;

  focused: boolean;
  hoverDelete: boolean;

  constructor() {}

  get hasErrorInTitle() {
    return this.fg_fields.get('JSStitle' + this.sectionNumber).invalid;
  }

  get hasErrorInBody() {
    return this.fg_fields.get('JSSbody' + this.sectionNumber).invalid;
  }

  get errorMessageTitle() {
    const control = this.fg_fields.controls['JSStitle' + this.sectionNumber];

    const required = control.hasError('required');
    const max = control.hasError('maxlength');

    return control.touched
      ? required
        ? '... is required'
        : max
          ? 'maximum 70 characters allowed'
          : ''
      : '';
  }

  get errorMessageBody() {
    const control = this.fg_fields.controls['JSSbody' + this.sectionNumber];

    const required = control.hasError('required');
    const max = control.hasError('maxlength');

    return control.touched
      ? required
        ? '... is required'
        : max
          ? 'maximum 255 characters allowed'
          : ''
      : '';
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
  }

  onMouseOverDelete() {
    this.hoverDelete = true;
  }

  onMouseLeaveDelete() {
    this.hoverDelete = false;
  }

  onSectionDelete(sectionNumber: number) {
    // clear title/body values of this section
    this.fg_fields.controls['JSStitle' + sectionNumber].reset();
    this.fg_fields.controls['JSSbody' + sectionNumber].reset();
    // decrease number of sections by -1
    // if at least 1 section willl be left
    const initialSectionsCount = this.fg_fields.controls['SummarySections']
      .value;

    if (initialSectionsCount > 1) {
      this.fg_fields.controls['SummarySections'].patchValue(
        initialSectionsCount - 1
      );
    } else {
      console.log('cannot delete last section, just clear values');
    }
  }
}
