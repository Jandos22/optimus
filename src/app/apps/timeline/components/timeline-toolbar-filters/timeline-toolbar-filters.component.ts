import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline-toolbar-filters',
  styleUrls: ['timeline-toolbar-filters.component.scss'],
  template: `
    <span class="toolbarButton__wrapper--primary">
        <button mat-icon-button matTooltip="Choose filters">
            <fa-icon [icon]="['fas', 'filter']"></fa-icon>
        </button>
    </span>
    `
})
export class TimelineToolbarFiltersComponent {
  constructor() {}
}
