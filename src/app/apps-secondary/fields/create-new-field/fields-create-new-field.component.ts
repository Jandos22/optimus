import { Component, Inject } from '@angular/core';

// material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// rxjs
import { take } from 'rxjs/operators';

// services
import { FieldsService } from '../services/fields.service';

// interfaces
import { FieldItem } from '../../../shared/interface/fields.model';

@Component({
  selector: 'app-fields-create-new-field',
  styleUrls: ['fields-create-new-field.component.scss'],
  providers: [FieldsService],
  template: `
        <h1 mat-dialog-title>{{ data.field }}</h1>

        <mat-dialog-content>
          <div>Are you sure you want to create new field?</div>
        </mat-dialog-content>

        <mat-dialog-actions fxLayout="row nowrap" fxLayoutAlign="end center">

          <button mat-button color='primary'
            [disabled]="creating"
            (click)="create(data.field)">
            <span *ngIf="!creating">CREATE</span>
            <span *ngIf="creating">CREATING </span>
            <fa-icon *ngIf="creating" [icon]="['fas', 'spinner']" [spin]="true" matTooltip="Creating new field"></fa-icon>
          </button>

          <button mat-button mat-dialog-close>CANCEL</button>

        </mat-dialog-actions>
    `
})
export class FieldsCreateNewFieldComponent {
  // will be TRUE when CREATE button is clicked
  // will be TRUE until create action completes successfully or with error
  creating: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { field: string },
    public dialogRef: MatDialogRef<FieldsCreateNewFieldComponent>,
    private srv: FieldsService
  ) {}

  create(field: string) {
    // toggle creating
    this.creating = true;

    // self completing subscription
    const $create = this.srv
      .create({ Title: field })
      .pipe(take(1))
      .subscribe(
        created => this.createSuccess(created),
        error => console.log(error),
        () => console.log('successfully created new field')
      );
  }

  // close dialog box if field was successfully created
  createSuccess(newField: FieldItem) {
    console.log(newField);
    // provide newly create field when closing dialog box
    this.dialogRef.close(newField);
  }
}
