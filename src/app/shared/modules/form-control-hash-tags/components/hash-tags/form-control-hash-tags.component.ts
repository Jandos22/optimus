import { FormMode } from './../../../../interface/form.model';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-control-hash-tags',
  styleUrls: ['form-control-hash-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <textarea matInput
          placeholder="Hash Tags"
          formControlName="HashTags"
          cdkTextareaAutosize
          #autosize="cdkTextareaAutosize"
          spellcheck="false"
          cdkAutosizeMaxRows="1"
          cdkAutosizeMaxRows="2">
      </textarea>
      <mat-hint align="start" *ngIf="mode !== 'view'">#usit #usrs-b</mat-hint>
      <mat-hint align="end" *ngIf="mode !== 'view'">{{ fg_fields.get('HashTags').value?.length }} / 140</mat-hint>
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class FormControlHashTagsComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('HashTags').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['HashTags'];

    const required = control.hasError('required');
    const max = control.hasError('maxlength');

    return this.fg_fields.get('HashTags').touched
      ? required
        ? '... is required'
        : max
          ? 'maximum 140 characters allowed'
          : ''
      : '';
  }
}
