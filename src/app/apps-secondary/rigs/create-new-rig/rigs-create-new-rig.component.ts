import { Component, Inject } from '@angular/core';

// material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// rxjs
import { take } from 'rxjs/operators';

// services
import { RigsService } from '../services/rigs.service';

// interfaces
import { RigItem } from '../../../shared/interface/rigs.model';

@Component({
  selector: 'app-rigs-create-new-rig',
  styleUrls: ['rigs-create-new-rig.component.scss'],
  // providers: [RigsService],
  template: `
        <h1 mat-dialog-title>{{ data.rig }}</h1>

        <mat-dialog-content>
          <div>Are you sure you want to create new rig?</div>
        </mat-dialog-content>

        <mat-dialog-actions fxLayout="row nowrap" fxLayoutAlign="end center">

          <button mat-button color='primary'
            [disabled]="creating"
            (click)="create(data.rig)">
            <span *ngIf="!creating">CREATE</span>
            <span *ngIf="creating">CREATING </span>
            <fa-icon *ngIf="creating" [icon]="['fas', 'spinner']" [spin]="true" matTooltip="Creating new rig"></fa-icon>
          </button>

          <button mat-button mat-dialog-close>CANCEL</button>

        </mat-dialog-actions>
    `
})
export class RigsCreateNewRigComponent {
  // will be TRUE when CREATE button is clicked
  // will be TRUE until create action completes successfully or with error
  creating: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { rig: string },
    public dialogRef: MatDialogRef<RigsCreateNewRigComponent>,
    private srv: RigsService
  ) {}

  create(rig: string) {
    // toggle creating
    this.creating = true;

    // self completing subscription
    const $create = this.srv
      .create({ Title: rig })
      .pipe(take(1))
      .subscribe(
        created => this.createSuccess(created),
        error => console.log(error),
        () => console.log('successfully created new rig')
      );
  }

  // close dialog box if rig was successfully created
  createSuccess(newRig: RigItem) {
    console.log(newRig);
    // provide newly create rig when closing dialog box
    this.dialogRef.close(newRig);
  }
}
