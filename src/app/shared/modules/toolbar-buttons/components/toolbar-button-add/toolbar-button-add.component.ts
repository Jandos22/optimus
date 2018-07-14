import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar-button-add',
  styleUrls: ['toolbar-button-add.component.scss'],
  template: `
    <div class="common-button">
        <button mat-icon-button [matTooltip]="tooltip"
            (click)="openForm.emit()">
            <span class="fa_regular"><fa-icon [icon]="['fas', 'plus']"></fa-icon></span>
        </button>
    </div>
    `
})
export class ToolbarButtonAddComponent {
  @Input() tooltip: string;

  @Output() openForm = new EventEmitter<any>();

  constructor() {}
}
