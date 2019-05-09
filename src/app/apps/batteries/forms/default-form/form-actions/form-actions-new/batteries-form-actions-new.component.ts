import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { FormGroup } from "@angular/forms";

import * as _ from "lodash";

// rxjs
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";

// ngrx
import { Store } from "@ngrx/store";
import * as fromRoot from "../../../../../../store";
import * as fromBatteries from "../../../../store";

// ngrx actions
import * as fromErrorActions from "../../../../../../store/actions/errors.actions";
import * as fromBatteriesActions from "../../../../store/actions/batteries.actions";

// services
import { BatteriesFormHttpService } from "../../form-services/batteries-form-http.service";

// interfaces
import { BatteryItem } from "../../../../../../shared/interface/batteries.model";
import { PeopleItem } from "../../../../../people/models/people-item.model";

@Component({
  selector: "app-batteries-form-actions-new",
  styleUrls: ["batteries-form-actions-new.component.scss"],
  template: `
    <!-- <button mat-button color="primary" (click)="log()">LOG</button> -->

    <button
      mat-button
      color="primary"
      [disabled]="!fg_fields.valid || savingChanges"
      [ngClass]="{ 'mat-button__fa-icon': savingChanges }"
      (click)="onSave()"
    >
      <span *ngIf="!savingChanges">SAVE</span>
      <span *ngIf="savingChanges">SAVING </span>
      <fa-icon
        *ngIf="savingChanges"
        [icon]="['fas', 'spinner']"
        [spin]="true"
        matTooltip="Saving changes"
      ></fa-icon>
    </button>

    <button mat-button tabindex="-1" (click)="closeForm.emit()">
      CANCEL
    </button>
  `
})
export class BatteriesFormActionsNewComponent implements OnInit, OnDestroy {
  @Input()
  fg_fields: FormGroup;

  @Input()
  selfUser?: PeopleItem;

  @Output()
  closeForm = new EventEmitter<any>();

  // activates spinner
  savingChanges = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_batteries: Store<fromBatteries.BatteriesState>,
    private spHttp: BatteriesFormHttpService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  onSave() {
    this.savingChanges = true;
    this.saveFields(this.fg_fields.getRawValue());
  }

  saveFields(newFields: BatteryItem) {
    console.log(newFields);

    // trim out empty fields
    newFields = _.reduce(
      newFields,
      function(acc, value, key) {
        return value ? { ...acc, [key]: value } : { ...acc };
      },
      {}
    );

    console.log(newFields);

    // add last updated info
    newFields = {
      ...newFields,
      LastUpdatedById: this.selfUser.Id,
      LastUpdated: new Date(Date.now())
    };

    this.spHttp
      .createItem(newFields)
      .pipe(take(1))
      .subscribe(
        success => this.saveFieldsSuccess(success as BatteryItem),
        error => this.saveFieldsError(error),
        () => console.log("completed adding new user")
      );
  }

  saveFieldsSuccess(newEvent: BatteryItem) {
    // add newly created user to users store
    // update fg_photo by adding ID of created user
    // check if form has unsaved photo and upload it
    // if no unsaved photo, then close form
    console.log("get new user");
    console.log(newEvent);
    this.spHttp
      .getItemById(newEvent.ID)
      .pipe(take(1))
      .subscribe(
        success => this.getNewlyCreatedItemSuccess(success as BatteryItem[]),
        error => console.log(error),
        () => console.log("completed getting newly created item")
      );
  }

  getNewlyCreatedItemSuccess(newItemExpanded: BatteryItem[]) {
    console.log("get new item expanded");
    console.log(newItemExpanded);
    this.store_batteries.dispatch(
      new fromBatteriesActions.InsertOneBattery({
        ...newItemExpanded[0],
        id: newItemExpanded[0].ID
        // New: true
      })
    );
    this.closeFormOrUploadPhoto();
  }

  saveFieldsError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  closeFormOrUploadPhoto() {
    console.log(this.fg_fields.value);
    this.savingChanges = false;
    this.closeForm.emit({
      result: "success",
      data: this.fg_fields.value
    });
  }

  log() {
    console.log(this.fg_fields.getRawValue());
  }
}
