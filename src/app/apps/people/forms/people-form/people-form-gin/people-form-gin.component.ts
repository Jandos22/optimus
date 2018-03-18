import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-gin',
  styleUrls: ['people-form-gin.component.css'],
  template: `
    <div [formGroup]="parent" fxFlex>
        <mat-form-field fxFlex>
            <input matInput placeholder="Gin" formControlName="Gin" autocomplete="off">
            <mat-error *ngIf="parent.get('Gin').invalid"></mat-error>
        </mat-form-field>
    </div>
    `
})
export class PeopleFormGinComponent {
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {
    this.parent.controls;
  }
}
