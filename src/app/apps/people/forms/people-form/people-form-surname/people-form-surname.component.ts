import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-surname',
  styleUrls: ['people-form-surname.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
  <div [formGroup]="parent" fxFlex>
    <mat-form-field fxFlex>
        <input matInput placeholder="Surname" formControlName="Surname" autocomplete="off">
        <mat-error *ngIf="parent.get('Surname').invalid"></mat-error>
    </mat-form-field>
  </div>
  `
})
export class PeopleFormSurnameComponent implements OnInit {
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {
    this.parent.controls;
  }
}
