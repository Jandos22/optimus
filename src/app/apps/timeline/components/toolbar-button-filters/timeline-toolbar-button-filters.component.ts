import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline-toolbar-button-filters',
  styleUrls: ['timeline-toolbar-button-filters.component.scss'],
  template: `
    <div class="common-button">
        <button mat-icon-button matTooltip="Choose filters">
            <span class="fa_regular"><fa-icon [icon]="['fas', 'filter']"></fa-icon></span>
        </button>
    </div>
    `
})
export class TimelineToolbarButtonFiltersComponent {
  constructor() {}
}
