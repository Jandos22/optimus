import { Locations } from './../../../../../models/locations.m';
import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-location',
  styleUrls: ['people-form-location.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="parent" fxFlex [ngClass]="{ 'hasError': hasError }">
        <mat-form-field fxFlex>
          <mat-select placeholder="Location" formControlName="Location" [disabled]="disabled">
            <mat-option *ngFor="let item of locations" [value]="item.Location">
                {{ item.Location }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormLocationComponent {
  @Input() parent: FormGroup;
  @Input() locations: Locations;
  @Input() disabled: boolean;

  constructor() {}

  ngOnInit() {
    this.parent.controls;
  }

  get hasError() {
    return this.parent.get('Gin').invalid;
  }

  get errorMessage() {
    const required = this.parent.controls['Location'].hasError('required');
    return this.parent.controls['Location'].touched
      ? required ? 'Location is required' : ''
      : '';
  }
}
