import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// interfaces
import { LocationEnt } from '../../../../../../shared/interface/locations.model';

@Component({
  selector: 'app-timeline-form-locations',
  styleUrls: ['timeline-form-locations.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields.get('LocationsId')">
      <mat-select multiple
        placeholder="Locations"
        formControlName="results">
        <mat-option
          *ngFor="let item of locations | selectLocations: locationAssignedId : accessLevel"
          [value]="item.id">
            {{ item.Title }}
        </mat-option>
      </mat-select>
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class TimelineFormLocationsComponent {
  @Input() fg_fields: FormGroup;
  @Input() locationAssignedId: number;
  @Input() accessLevel: number;
  @Input() locations: LocationEnt[];

  constructor() {}

  get hasError() {
    return this.fg_fields.get('LocationsId').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.controls['LocationsId'].hasError(
      'required'
    );
    return this.fg_fields.controls['LocationsId'].touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
