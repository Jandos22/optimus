import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-surname',
  styleUrls: ['people-form-surname.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [formGroup]="parent" fxFlex class="my-form-field_container">
    <mat-form-field fxFlexFill>
        <input matInput placeholder="Surname" formControlName="Surname" autocomplete="off">
        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  </div>
  `
})
export class PeopleFormSurnameComponent implements OnInit {
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {
    // this.parent.controls;
  }

  get hasError() {
    return this.parent.get('Surname').invalid;
  }

  get errorMessage() {
    const required = this.parent.controls['Surname'].hasError('required');

    return this.parent.controls['Surname'].touched
      ? required
        ? 'Surname is required'
        : ''
      : '';
  }
}
