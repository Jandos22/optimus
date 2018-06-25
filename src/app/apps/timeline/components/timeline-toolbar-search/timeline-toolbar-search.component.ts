import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeline-toolbar-search',
  styleUrls: ['timeline-toolbar-search.component.scss'],
  template: `
    <div [formGroup]="fg_params">
        <mat-form-field [floatLabel]="'never'" [color]="'primary'">
            <input matInput
                type="text"
                placeholder="Search"
                formControlName="query"
                autocomplete="off">
            <button
                mat-button *ngIf="fg_params.get('query').value"
                matSuffix mat-icon-button aria-label="Clear"
                (click)="clearQuery()">
                <mat-icon>close</mat-icon>
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
}
