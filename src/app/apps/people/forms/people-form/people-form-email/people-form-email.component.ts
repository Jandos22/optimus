import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-email',
  styleUrls: ['people-form-email.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div [formGroup]="parent" fxFlex [ngClass]="{ 'hasError': hasError }">
        <mat-form-field fxFlex>
            <input matInput placeholder="Email" formControlName="Email" autocomplete="off">
            <mat-error *ngIf="parent.get('Email').invalid">{{ errorMessage}}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormEmailComponent implements OnInit {
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {
    this.parent.controls;
  }

  get hasError() {
    return this.parent.get('Email').invalid;
  }

  get errorMessage() {
    const required = this.parent.controls['Email'].hasError('required');

    return this.parent.controls['Email'].touched
      ? required ? 'Email is required' : ''
      : '';
  }
}
