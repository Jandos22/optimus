import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-timeline-toolbar-button-add',
  styleUrls: ['timeline-toolbar-button-add.component.scss'],
  template: `
    <div class="common-button">
        <button mat-icon-button matTooltip="Post new event"
            (click)="openForm.emit()">
            <span class="fa_regular"><fa-icon [icon]="['fas', 'plus']"></fa-icon></span>
        </button>
    </div>
    `
})
export class TimelineToolbarButtonAddComponent {
  @Output() openForm = new EventEmitter<any>();

  constructor() {}
}
