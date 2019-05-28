import { Component, Output, EventEmitter } from "@angular/core";

import { FormMode } from "../../../../../../shared/interface/form.model";

@Component({
  selector: "app-batteries-form-actions-view",
  styleUrls: ["batteries-form-actions-view.component.scss"],
  template: `
    <button
      mat-icon-button
      tabindex="-1"
      matTooltip="delete battery"
      (click)="deleteItem.emit()"
    >
      <span class="fa_regular"
        ><fa-icon [icon]="['far', 'trash-alt']"></fa-icon
      ></span>
    </button>

    <div fxFlex></div>

    <button
      mat-button
      tabindex="-1"
      color="primary"
      (click)="switchFormMode.emit('edit')"
    >
      EDIT
    </button>

    <button mat-button tabindex="-1" (click)="closeForm.emit()">
      CLOSE
    </button>
  `
})
export class BatteriesFormActionsViewComponent {
  @Output()
  switchFormMode = new EventEmitter<FormMode>();

  @Output()
  closeForm = new EventEmitter<any>();

  @Output()
  deleteItem = new EventEmitter<any>();

  constructor() {}
}
