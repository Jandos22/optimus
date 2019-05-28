import { FormMode } from "../../../../../../shared/interface/form.model";
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormGroup, FormControl, AbstractControl } from "@angular/forms";

@Component({
  selector: "app-batteries-form-hours",
  styleUrls: ["batteries-form-hours.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input
        matInput
        placeholder="Hours used"
        formControlName="Hours"
        autocomplete="off"
      />
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class BatteriesFormHoursComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get("Hours").invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get("Hours").hasError("required");

    return this.fg_fields.get("Hours").touched
      ? required
        ? "Hours used is required"
        : ""
      : "";
  }
}
