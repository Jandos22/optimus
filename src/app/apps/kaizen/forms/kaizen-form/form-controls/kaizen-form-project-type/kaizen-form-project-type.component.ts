import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
import { KaizenProjectType } from '../../../../../../shared/interface/kaizen.model';

@Component({
  selector: 'app-kaizen-form-project-type',
  styleUrls: ['kaizen-form-project-type.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields.get('ProjectTypeId')">

      <mat-select multiple placeholder="Project Type" formControlName="results"
        [disabled]="mode === 'view'">

        <mat-option *ngFor="let item of projectTypes" [value]="item.id">
            {{ item.Title }}
        </mat-option>

      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class KaizenFormProjectTypeComponent {
  @Input() fg_fields: FormGroup;
  @Input() projectTypes: KaizenProjectType[];
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('ProjectTypeId').get('results').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields
      .get('ProjectTypeId')
      .get('results')
      .hasError('required');

    return this.fg_fields.get('ProjectTypeId').get('results').touched
      ? required
        ? 'ProjectTypeId is required'
        : ''
      : '';
  }
}
