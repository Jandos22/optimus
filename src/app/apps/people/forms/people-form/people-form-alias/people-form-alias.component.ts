import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-alias',
  styleUrls: ['people-form-alias.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div [formGroup]="parent" fxFlex [ngClass]="{ 'hasError': hasError }">
        <mat-form-field fxFlex>
            <input matInput placeholder="Alias" formControlName="Alias" autocomplete="off">
            <mat-error *ngIf="parent.get('Alias').invalid">{{ errorMessage }}</mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormAliasComponent implements OnInit {
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {
    this.parent.controls;
  }

  get hasError() {
    return this.parent.get('Alias').invalid;
  }

  get errorMessage() {
    const required = this.parent.controls['Alias'].hasError('required');

    return this.parent.controls['Alias'].touched
      ? required ? 'Alias is required' : ''
      : '';
  }
}
