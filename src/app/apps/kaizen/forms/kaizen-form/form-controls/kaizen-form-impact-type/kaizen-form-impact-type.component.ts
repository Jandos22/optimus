import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
import { KaizenImpactType } from '../../../../../../shared/interface/kaizen.model';

@Component({
  selector: 'app-kaizen-form-impact-type',
  styleUrls: ['kaizen-form-impact-type.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">

      <mat-select placeholder="Impact" formControlName="ImpactTypeId"
        [disabled]="mode === 'view'">

        <mat-option *ngFor="let item of impactTypes" [value]="item.id">
            {{ item.Title }}
        </mat-option>

      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class KaizenFormImpactTypeComponent {
  @Input() fg_fields: FormGroup;
  @Input() impactTypes: KaizenImpactType[];
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('ImpactTypeId').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('ImpactTypeId').hasError('required');

    return this.fg_fields.get('ImpactTypeId').touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
