import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-error-dialog-box',
  styleUrls: ['error-dialog-box.component.scss'],
  template: `
    <h2 matDialogTitle>Error</h2>
    <mat-dialog-content>
      <p>{{ data | json }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="closeError()" color="primary">CLOSE</button>
    </mat-dialog-actions>
    `
})
export class ErrorDialogBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  closeError() {
    this.dialogRef.close();
  }
}
