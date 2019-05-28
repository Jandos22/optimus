import { FormMode } from "../../../../../../shared/interface/form.model";

import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from "@angular/core";

import { FormGroup, FormControl, AbstractControl } from "@angular/forms";

@Component({
  selector: "app-batteries-form-details",
  styleUrls: ["batteries-form-details.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <textarea
        matInput
        placeholder="Details"
        formControlName="Details"
        cdkTextareaAutosize
        #autosize="cdkTextareaAutosize"
        cdkAutosizeMinRows="1"
        cdkAutosizeMaxRows="6"
      >
      </textarea>
      <mat-hint align="end" *ngIf="mode !== 'view'">
        {{ fg_fields.get("Details").value?.length }} / {{ max }}
      </mat-hint>
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class BatteriesFormDetailsComponent {
  @Input()
  fg_fields: FormGroup;

  @Input()
  mode: FormMode;

  @Input()
  max: number;

  constructor() {}

  get hasError() {
    return this.fg_fields.get("Details").invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls["Details"];

    const required = control.hasError("required");
    const max = control.hasError("maxlength");

    return this.fg_fields.get("Details").touched
      ? required
        ? "... is required"
        : max
        ? `maximum ${this.max} characters allowed`
        : ""
      : "";
  }
}
