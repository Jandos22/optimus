import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// interfaces
import { LocationEnt } from '../../../../../../shared/interface/locations.model';
import { FormMode } from '../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-people-form-locations',
  styleUrls: ['people-form-locations.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div fxFlex class="my-form-field_container">
        <mat-form-field fxFlexFill [formGroup]="fg_fields.get('LocationsOfInterestId')">
          <mat-select
            placeholder="Locations of Interest"
            formControlName="results"
            [disabled]="mode === 'view'"
            multiple>
            <mat-option *ngFor="let item of locations" [value]="item.id">
                {{ item.Title }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormLocationsComponent {
  @Input()
  fg_fields: FormGroup;

  @Input()
  locations: LocationEnt[];

  @Input()
  mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('LocationsOfInterestId').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.controls['LocationsOfInterestId'].hasError(
      'required'
    );
    return this.fg_fields.controls['LocationsOfInterestId'].touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
