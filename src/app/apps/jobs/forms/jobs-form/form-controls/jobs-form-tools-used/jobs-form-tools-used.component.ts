import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
import { ToolItem } from '../../../../../../shared/interface/tools.model';

@Component({
  selector: 'app-jobs-form-tools-used',
  styleUrls: ['jobs-form-tools-used.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields.get('ToolsUsedId')">

      <mat-select multiple placeholder="Tools Used" formControlName="results"
        [disabled]="mode === 'view'">

        <mat-option *ngFor="let item of toolNames" [value]="item.id">
            {{ item.Title }}
        </mat-option>

      </mat-select>

    </mat-form-field>
  `
})
export class JobsFormToolsUsedComponent {
  @Input() fg_fields: FormGroup;
  @Input() toolNames: ToolItem[];
  @Input() mode: FormMode;

  constructor() {}

  // at this time 27-Jul-2018
  // tools used are optional, so no error messages needed
}
