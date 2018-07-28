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
  selector: 'app-people-form-location',
  styleUrls: ['people-form-location.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="fg_fields" fxFlex class="my-form-field_container">
        <mat-form-field fxFlexFill>
          <mat-select placeholder="Location Assigned" formControlName="LocationAssignedId"
            [disabled]="mode === 'view' || ual < 3">
            <mat-option *ngFor="let item of locations" [value]="item.id">
                {{ item.Title }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormLocationComponent {
  @Input() fg_fields: FormGroup;
  @Input() locations: LocationEnt[];
  @Input() mode: FormMode;
  @Input() ual: number; // user access level
  // @Input() disabled: boolean;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('LocationAssignedId').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.controls['LocationAssignedId'].hasError(
      'required'
    );
    return this.fg_fields.controls['LocationAssignedId'].touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
