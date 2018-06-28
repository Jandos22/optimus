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
  selector: 'app-new-user-form-location',
  styleUrls: ['new-user-form-location.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="parent" fxFlex class="my-form-field_container">
        <mat-form-field fxFlexFill>
          <mat-select placeholder="Location Assigned" formControlName="LocationAssignedId">
            <mat-option *ngFor="let item of locations" [value]="item.id">
                {{ item.Title }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class NewUserFormLocationComponent {
  @Input() parent: FormGroup;
  @Input() locations: LocationEnt[];

  constructor() {}

  get hasError() {
    return this.parent.get('LocationAssignedId').invalid;
  }

  get errorMessage() {
    const required = this.parent.controls['LocationAssignedId'].hasError(
      'required'
    );
    return this.parent.controls['LocationAssignedId'].touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
