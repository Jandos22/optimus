import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-list-item-retry',
  styleUrls: ['delete-list-item-retry.component.scss'],
  template: `
    <h2 matDialogTitle>Delete</h2>
    <mat-dialog-content>
      <p>Ooops! I couldn't delete list item ... do you want to retry?</p>
    </mat-dialog-content>
    <mat-dialog-actions fxLayout="row nowrap" fxLayoutAlign="end start">
      <button mat-button (click)="retry()" tabindex="-1">RETRY DELETE</button>
      <button mat-button (click)="cancel()" color="primary" tabindex="1">CANCEL</button>
    </mat-dialog-actions>
    `
})
export class DeleteListItemRetryComponent {
  constructor(public dialogRef: MatDialogRef<DeleteListItemRetryComponent>) {}

  retry() {
    console.log('deleting list item');
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
