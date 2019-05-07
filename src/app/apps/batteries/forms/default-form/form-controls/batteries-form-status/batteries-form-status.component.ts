import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

import { FormGroup } from "@angular/forms";

import * as _ from "lodash";

// interfaces
import { FormMode } from "../../../../../../shared/interface/form.model";

// constants
import { batteryStatuses } from "../../../../constants/battery-statuses.constants";

@Component({
  selector: "app-batteries-form-status",
  styleUrls: ["batteries-form-status.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <mat-select
        [placeholder]="'Status'"
        formControlName="Status"
        [disabled]="isDisabled"
      >
        <mat-option *ngFor="let status of statuses" [value]="status">
          {{ status }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `
})
export class BatteriesFormStatusComponent {
  @Input()
  fg_fields: FormGroup;

  @Input()
  mode: FormMode;

  // remove "All" from batteryStatuses,
  // it is first element in array,
  // it is not needed to be selectable in Battery Form,
  // but only needed in Battery Filters
  private statuses: string[] = _.drop(batteryStatuses, 1);

  constructor() {}

  get isDisabled() {
    return this.mode === "view" ? true : false;
  }
}
