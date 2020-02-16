import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormGroup, FormControl, AbstractControl } from "@angular/forms";

// interfaces
import { FormMode } from "./../../../../../../shared/interface/form.model";

// date-fns
import * as format from "date-fns/format";

@Component({
  selector: "app-jobs-form-ftl",
  styleUrls: ["jobs-form-ftl.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input
        matInput
        placeholder="Field Ticket"
        formControlName="Ftl"
        autocomplete="off"
      />

      <button
        mat-icon-button
        matTooltip="find in FTL Inbox"
        matSuffix
        *ngIf="
          this.fg_fields.controls['Ftl'].value &&
          !this.fg_fields.controls['Ftl'].errors
        "
        (click)="openFtl()"
      >
        <span class="fa_regular"
          ><fa-icon [icon]="['fas', 'money-check-alt']"></fa-icon
        ></span>
      </button>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class JobsFormFtlComponent {
  @Input() fg_fields: FormGroup;
  // @Input() mode: FormMode;

  // &subfromdate=01-Mar-2019&subtodate=31-May-2019

  constructor() {}

  openFtl() {
    const ftl = this.fg_fields.controls["Ftl"].value;
    let startDate = this.fg_fields.controls["RigUpStart"].value;
    startDate = startDate ? format(startDate, "DD-MMM-YYYY") : null;

    if (ftl) {
      let url = `https://ftl.ebusiness.slb.com/inbox.cfm?srch=1&type=t&ticket=${ftl}`;

      if (startDate) {
        url += `&subfromdate=${startDate}`;
      }

      window.open(url, "_blank");
    }
  }

  get hasError() {
    return this.fg_fields.get("Ftl").invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls["Ftl"];

    const required = control.hasError("required");
    const min = control.hasError("minlength");
    const max = control.hasError("maxlength");

    return this.fg_fields.get("Ftl").touched
      ? required
        ? "... is required"
        : min
        ? "min 10 characters allowed"
        : max
        ? "max 11 characters allowed"
        : ""
      : "";
  }
}
