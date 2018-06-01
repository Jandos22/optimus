// import { Locations } from './../../../../../models/locations.m';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// interfaces
import { LocationEnt } from './../../../../../shared/interface/locations.model';

@Component({
  selector: 'app-people-form-location',
  styleUrls: ['people-form-location.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="parent" fxFlex class="my-form-field_container">
        <mat-form-field fxFlexFill>
          <mat-select placeholder="Location" formControlName="Location" [disabled]="disabled">
            <mat-option *ngFor="let item of locations" [value]="item.Title">
                {{ item.Title }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormLocationComponent {
  @Input() parent: FormGroup;
  @Input() locations: LocationEnt[];
  @Input() disabled: boolean;

  constructor() {}

  get hasError() {
    return this.parent.get('Gin').invalid;
  }

  get errorMessage() {
    const required = this.parent.controls['Location'].hasError('required');
    return this.parent.controls['Location'].touched
      ? required
        ? 'Location is required'
        : ''
      : '';
  }
}
