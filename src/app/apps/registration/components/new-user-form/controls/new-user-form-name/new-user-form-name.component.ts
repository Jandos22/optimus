import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
// import { FormMode } from './../../../../../models/form-mode.model';

@Component({
  selector: 'app-new-user-form-name',
  styleUrls: ['new-user-form-name.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [formGroup]="parent" fxFlex class="my-form-field_container">
    <mat-form-field fxFlexFill>
        <input matInput placeholder="Name" formControlName="Name" autocomplete="off">
        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  </div>
  `
})
export class NewUserFormNameComponent {
  @Input() parent: FormGroup;
  // @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.parent.get('Name').invalid;
  }

  get errorMessage() {
    const required = this.parent.get('Name').hasError('required');

    return this.parent.get('Name').touched
      ? required
        ? 'Name is required'
        : ''
      : '';
  }
}
