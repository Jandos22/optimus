import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-location',
  styleUrls: ['people-form-location.component.css'],
  template: `
    <div [formGroup]="parent" fxFlex>
        <mat-form-field fxFlex>
            <input matInput placeholder="Location" formControlName="Location" autocomplete="off">
            <mat-error *ngIf="parent.get('Location').invalid"></mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormLocationComponent {
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {
    this.parent.controls;
  }
}
