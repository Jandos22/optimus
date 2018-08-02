import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-list-item',
  styleUrls: ['delete-list-item.component.scss'],
  template: `
    <h2 matDialogTitle>Delete</h2>
    <mat-dialog-content>
      <p>Are you sure you want to permanently delete this item?</p>
    </mat-dialog-content>
    <mat-dialog-actions fxLayout="row nowrap" fxLayoutAlign="end start">
      <button mat-button (click)="delete()" tabindex="-1">DELETE</button>
      <button mat-button (click)="cancel()" color="primary" tabindex="1">CANCEL</button>
    </mat-dialog-actions>
    `
})
export class DeleteListItemComponent {
  constructor(public dialogRef: MatDialogRef<DeleteListItemComponent>) {}

  delete() {
    console.log('deleting list item');
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
