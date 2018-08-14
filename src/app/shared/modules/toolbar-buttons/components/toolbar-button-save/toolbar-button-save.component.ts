import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar-button-save',
  styleUrls: ['toolbar-button-save.component.scss'],
  template: `
    <div class="common-button">
        <button
            mat-icon-button
            matTooltip="Save in PDF"
            (click)="onSave.emit()">
            <span class="fa_regular"><fa-icon [icon]="['far', 'save']"></fa-icon></span>
        </button>
    </div>
    `
})
export class ToolbarButtonSaveComponent {
  constructor() {}

  @Output()
  onSave = new EventEmitter<any>();
}
