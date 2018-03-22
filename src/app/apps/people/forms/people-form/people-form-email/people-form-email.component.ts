import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-email',
  styleUrls: ['people-form-email.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div [formGroup]="parent" fxFlex>
        <mat-form-field fxFlex>
            <input matInput placeholder="Email" formControlName="Email" autocomplete="off">
            <mat-error *ngIf="parent.get('Email').invalid"></mat-error>
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
}
