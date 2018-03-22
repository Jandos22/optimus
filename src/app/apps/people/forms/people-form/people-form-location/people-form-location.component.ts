import { Locations } from './../../../../../models/locations.m';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-location',
  styleUrls: ['people-form-location.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div [formGroup]="parent" fxFlex>
        <mat-form-field fxFlex>
          <mat-select placeholder="Location" formControlName="Location" [disabled]="disabled">
            <mat-option *ngFor="let item of locations" [value]="item.Location">
                {{ item.Location }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="parent.get('Location').invalid"></mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormLocationComponent {
  @Input() parent: FormGroup;
  @Input() locations: Locations;
  @Input() disabled: boolean;

  constructor() {}

  ngOnInit() {
    this.parent.controls;
  }
}
