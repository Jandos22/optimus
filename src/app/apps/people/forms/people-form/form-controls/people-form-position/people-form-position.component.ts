import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';
import { UserPosition } from '../../../../../../shared/interface/people.model';

@Component({
  selector: 'app-people-form-position',
  styleUrls: ['people-form-position.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">

      <!-- disabled when access level is less than 3 -->
      <mat-select placeholder="Position" formControlName="PositionId" [disabled]="mode === 'view' || ual < 3">
        <mat-option *ngFor="let position of positions" [value]="position.Id">
          {{ position.Title }}
        </mat-option>
      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class PeopleFormPositionComponent {
  @Input() fg_fields: FormGroup;
  @Input() positions: UserPosition[];
  @Input() mode: FormMode;
  @Input() ual: number; // user access level

  // *** IMPLEMENT WHEN HAVE TIME
  // ? icons for different positions & access level

  constructor() {}

  get hasError() {
    return this.fg_fields.get('PositionId').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('PositionId').hasError('required');

    return this.fg_fields.get('PositionId').touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
