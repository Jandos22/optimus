import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-name',
  styleUrls: ['people-form-name.component.css'],
  template: `
  <div [formGroup]="parent" fxFlex>
    <mat-form-field fxFlex>
        <input matInput placeholder="Name" formControlName="Name" autocomplete="off">
        <mat-error *ngIf="parent.get('Name').invalid"></mat-error>
    </mat-form-field>
  </div>
  `
})
export class PeopleFormNameComponent implements OnInit {
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {
    this.parent.controls;
  }
}
