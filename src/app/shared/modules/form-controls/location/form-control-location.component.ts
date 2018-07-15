import { FormMode } from './../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// interfaces
import { LocationEnt } from '../../../../shared/interface/locations.model';

@Component({
  selector: 'app-form-control-location',
  styleUrls: ['form-control-location.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <mat-select [disabled]="mode === 'view'"
        placeholder="Locations"
        formControlName="LocationId">
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
export class FormControlLocationComponent {
  @Input() fg_fields: FormGroup;
  @Input() locationAssignedId: number;
  @Input() accessLevel: number;
  @Input() locations: LocationEnt[];
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('LocationId').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.controls['LocationId'].hasError('required');
    return this.fg_fields.controls['LocationId'].touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
