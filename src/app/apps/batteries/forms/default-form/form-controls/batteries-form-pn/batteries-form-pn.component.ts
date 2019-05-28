import { FormMode } from "../../../../../../shared/interface/form.model";
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormGroup, FormControl, AbstractControl } from "@angular/forms";

@Component({
  selector: "app-batteries-form-pn",
  styleUrls: ["batteries-form-pn.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input
        matInput
        placeholder="Part Number"
        formControlName="PN"
        autocomplete="off"
      />
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class BatteriesFormPartNumberComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get("PN").invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get("PN").hasError("required");

    return this.fg_fields.get("PN").touched
      ? required
        ? "Part Number is required"
        : ""
      : "";
  }
}
