import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-user-form-email',
  styleUrls: ['new-user-form-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [formGroup]="parent" fxFlex class="my-form-field_container">
        <mat-form-field fxFlexFill>
            <input matInput placeholder="Email" formControlName="Email" autocomplete="off">
            <mat-error *ngIf="parent.get('Email').invalid">{{ errorMessage}}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class NewUserFormEmailComponent {
  @Input() parent: FormGroup;

  constructor() {}

  get hasError() {
    return this.parent.get('Email').invalid;
  }

  get errorMessage() {
    const required = this.parent.controls['Email'].hasError('required');

    return this.parent.controls['Email'].touched
      ? required
        ? 'Email is required'
        : ''
      : '';
  }
}
