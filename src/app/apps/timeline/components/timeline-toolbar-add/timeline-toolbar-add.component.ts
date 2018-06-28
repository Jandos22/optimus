import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline-toolbar-add',
  styleUrls: ['timeline-toolbar-add.component.scss'],
  template: `
    <span class="toolbarButton__wrapper--primary">
        <button mat-icon-button matTooltip="Post new event">
            <span class="fa_regular"><fa-icon [icon]="['fas', 'plus']"></fa-icon></span>
        </button>
    </span>
    `
})
export class TimelineToolbarAddComponent {
  constructor() {}
}
