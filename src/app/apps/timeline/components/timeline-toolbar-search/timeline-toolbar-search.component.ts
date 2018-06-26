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
                mat-button *ngIf="fg_params.get('query').invalid && fg_params.get('query').value"
                matSuffix mat-icon-button [matTooltip]="errorMessage()"
                (click)="clearQuery()">
                <span class="inputquery__error--icon">
                    <fa-icon [icon]="['far', 'times-circle']"></fa-icon>
                </span>
            </button>
            <button
                mat-button *ngIf="fg_params.get('query').value && fg_params.get('query').valid"
                matSuffix mat-icon-button aria-label="Clear"
                (click)="clearQuery()">
                <!-- <mat-icon>close</mat-icon> -->
                <fa-icon [icon]="['fas', 'times']"></fa-icon>
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
