import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";

// ngrx
import { Store, select } from "@ngrx/store";
import * as fromBatteries from "../../../store";

// rxjs
import { take } from "rxjs/operators";

// material
import { MatDialog } from "@angular/material";

// services
import { BatteriesService } from "./../../../services/batteries.service";

// types
import { FormMode } from "../../../../../shared/interface/form.model";

// entry components
import {
  DeleteListItemComponent,
  DeleteListItemRetryComponent
} from "../../../../../shared/components";

// interfaces
import { SpListItemAttachmentFiles } from "../../../../../shared/interface/sp-list-item.model";
import { BatteryItem } from "../../../../../shared/interface/batteries.model";
import { PeopleItem } from "../../../../people/models/people-item.model";

@Component({
  selector: "app-batteries-form-actions",
  styleUrls: ["batteries-form-actions.component.scss"],
  template: `
    <app-batteries-form-actions-view
      *ngIf="mode === 'view'"
      class="form-actions-view"
      fxLayout="row nowrap"
      fxLayoutAlign="start center"
      (closeForm)="closeForm.emit()"
      (switchFormMode)="switchFormMode.emit($event)"
      (deleteItem)="onDelete()"
    >
    </app-batteries-form-actions-view>

    <app-batteries-form-actions-new
      *ngIf="mode === 'new'"
      fxLayout="row nowrap"
      fxLayoutAlign="end center"
      (closeForm)="closeForm.emit($event)"
      [fg_fields]="fg_fields"
      [selfUser]="selfUser"
    >
    </app-batteries-form-actions-new>

    <app-batteries-form-actions-edit
      *ngIf="mode === 'edit'"
      fxLayout="row nowrap"
      fxLayoutAlign="end center"
      [fg_fields]="fg_fields"
      [initialFields]="initialFields"
      [selfUser]="selfUser"
      (switchFormMode)="switchFormMode.emit($event)"
      (updateDataItem)="updateDataItem.emit($event)"
    >
    </app-batteries-form-actions-edit>
  `
})
export class BatteriesFormActionsComponent {
  @Input()
  mode: FormMode;

  @Input()
  fg_fields: FormGroup;

  @Input()
  initialFields: BatteryItem;

  @Input()
  selfUser?: PeopleItem;

  @Output()
  switchFormMode = new EventEmitter<any>();

  @Output()
  closeForm = new EventEmitter<any>();

  // triggered after saving fields and/or image
  @Output()
  updateDataItem = new EventEmitter<BatteryItem>();

  constructor(
    private store_harcs: Store<fromBatteries.BatteriesState>,
    private srv: BatteriesService,
    public deleteDialog: MatDialog,
    public retryDeleteDialog: MatDialog
  ) {}

  onDelete(): void {
    const dialogRef = this.deleteDialog.open(DeleteListItemComponent);

    dialogRef.afterClosed().subscribe(result => {
      // if true, then delete list item
      if (result) {
        const delete$ = this.srv.deleteItemById(this.initialFields.Id);
        delete$.pipe(take(1)).subscribe(
          deleted => {
            console.log("deleted");
            console.log(deleted);
            this.store_harcs.dispatch(
              new fromBatteries.DeleteOne(this.initialFields.Id)
            );
            this.closeForm.emit();
          },
          error => {
            console.log("could not delete");
            console.log(error);
            this.onRetryDelete();
          }
        );
      } else {
        console.log("do nothing");
      }
    });
  }

  onRetryDelete(): void {
    const dialogRef = this.deleteDialog.open(DeleteListItemRetryComponent);

    dialogRef.afterClosed().subscribe(result => {
      // if true, then delete list item
      if (result) {
        const delete$ = this.srv.deleteItemById(this.initialFields.Id);
        delete$.pipe(take(1)).subscribe(
          deleted => {
            console.log("deleted");
            console.log(deleted);
            this.store_harcs.dispatch(
              new fromBatteries.DeleteOne(this.initialFields.Id)
            );
            this.closeForm.emit();
          },
          error => {
            console.log("could not delete");
            console.log(error);
            this.onRetryDelete();
          }
        );
      } else {
        console.log("do nothing");
      }
    });
  }
}
