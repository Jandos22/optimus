import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-people-form-alias',
  styleUrls: ['people-form-alias.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div [formGroup]="parent" fxFlex class="my-form-field_container">
        <mat-form-field fxFlexFill>
            <input matInput placeholder="Alias" formControlName="Alias" autocomplete="off">
            <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormAliasComponent {
  @Input() parent: FormGroup;

  constructor() {}

  get hasError() {
    return this.parent.get('Alias').invalid;
  }

  get errorMessage() {
    const control = this.parent.controls['Alias'];
    const required = control.hasError('required');
    const uniqueAlias = control.hasError('uniqueAlias');

    return control.touched
      ? required
        ? '... is required'
        : uniqueAlias
          ? '... is already registered'
          : ''
      : '';
  }
}
