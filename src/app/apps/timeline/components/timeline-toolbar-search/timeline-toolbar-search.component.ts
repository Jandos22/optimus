import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeline-toolbar-search',
  styleUrls: ['timeline-toolbar-search.component.scss'],
  template: `
    <div [formGroup]="fg_params" fxLayout="row" class="timeline__query--container">
        <mat-form-field fxFlex="200px" [floatLabel]="'never'" [color]="'primary'">
            <input matInput
                type="text"
                [placeholder]="'Search'"
                formControlName="query"
                autocomplete="off">
            <button
                mat-button *ngIf="fg_params.get('query').invalid"
                matPrefix mat-icon-button [matTooltip]="errorMessage()">
                <span class="inputquery__error--icon"><i class="fas fa-exclamation-circle"></i></span>
            </button>
            <button
                mat-button *ngIf="fg_params.get('query').value"
                matSuffix mat-icon-button aria-label="Clear"
                (click)="clearQuery()">
                <!-- <mat-icon>close</mat-icon> -->
                <span class="fa_regular"><i class="fas fa-times"></i></span>
            </button>
        </mat-form-field>
    </div>
    `
})
export class TimelineToolbarSearchComponent {
  @Input() fg_params: FormGroup;
  constructor() {}

  clearQuery() {
    this.fg_params.get('query').patchValue('');
  }

  errorMessage() {
    const control = this.fg_params.controls['query'];

    const onlySearchable = control.hasError('onlySearchable');

    return control.dirty
      ? onlySearchable
        ? 'Only letters, numbers and #, -, _ are allowed'
        : ''
      : '';
  }
}
