import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline-toolbar-add',
  styleUrls: ['timeline-toolbar-add.component.scss'],
  template: `
    <span class="toolbarButton__wrapper--primary">
        <button mat-icon-button matTooltip="Post new event">
            <fa-icon [icon]="['fas', 'plus']"></fa-icon>
        </button>
    </span>
    `
})
export class TimelineToolbarAddComponent {
  constructor() {}
}
