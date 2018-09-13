import { Component, Inject } from '@angular/core';

// material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// rxjs
import { take } from 'rxjs/operators';

// services
import { ClientsService } from '../services/clients.service';

// interfaces
import { ClientItem } from '../../../shared/interface/clients.model';

@Component({
  selector: 'app-clients-create-new-client',
  styleUrls: ['clients-create-new-client.component.scss'],
  // providers: [ClientsService],
  template: `
        <h1 mat-dialog-title>{{ data.client }}</h1>

        <mat-dialog-content>
          <div>Are you sure you want to create new client?</div>
        </mat-dialog-content>

        <mat-dialog-actions fxLayout="row nowrap" fxLayoutAlign="end center">

          <button mat-button color='primary'
            [disabled]="creating"
            (click)="create(data.client)">
            <span *ngIf="!creating">CREATE</span>
            <span *ngIf="creating">CREATING </span>
            <fa-icon *ngIf="creating" [icon]="['fas', 'spinner']" [spin]="true" matTooltip="Creating new client"></fa-icon>
          </button>

          <button mat-button mat-dialog-close>CANCEL</button>

        </mat-dialog-actions>
    `
})
export class ClientsCreateNewClientComponent {
  // will be TRUE when CREATE button is clicked
  // will be TRUE until create action completes successfully or with error
  creating: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { client: string },
    public dialogRef: MatDialogRef<ClientsCreateNewClientComponent>,
    private srv: ClientsService
  ) {}

  create(client: string) {
    // toggle creating
    this.creating = true;

    // self completing subscription
    const $create = this.srv
      .create({ Title: client })
      .pipe(take(1))
      .subscribe(
        created => this.createSuccess(created),
        error => console.log(error),
        () => console.log('successfully created new client')
      );
  }

  // close dialog box if client was successfully created
  createSuccess(newClient: ClientItem) {
    console.log(newClient);
    // provide newly create client when closing dialog box
    this.dialogRef.close(newClient);
  }
}
