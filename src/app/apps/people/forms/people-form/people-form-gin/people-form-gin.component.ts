import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-gin',
  styleUrls: ['people-form-gin.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="parent" fxFlex [ngClass]="{ 'hasError': hasError }">
        <mat-form-field fxFlex>
            <input matInput placeholder="Gin" formControlName="Gin" autocomplete="off">
            <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormGinComponent {
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {
    // this.parent.controls;
  }

  get hasError() {
    return this.parent.get('Gin').invalid;
  }

  get errorMessage() {
    const required = this.parent.controls['Gin'].hasError('required');
    const min = this.parent.controls['Gin'].hasError('minlength');
    const max = this.parent.controls['Gin'].hasError('maxlength');
    const onlyNumbers = this.parent.controls['Gin'].hasError('onlyNumbers');

    return this.parent.controls['Gin'].touched
      ? required
        ? 'GIN number is required'
        : onlyNumbers
          ? 'Only numbers allowed'
          : min || max ? '8 digits required' : ''
      : '';
  }
}
