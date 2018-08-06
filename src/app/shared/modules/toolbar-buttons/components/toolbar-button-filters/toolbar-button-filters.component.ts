import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar-button-filters',
  styleUrls: ['toolbar-button-filters.component.scss'],
  template: `
    <div class="common-button">
        <button
            mat-icon-button
            matTooltip="show filters"
            (click)="toggleFilters.emit()">
            <span class="fa_regular"><fa-icon [icon]="['fas', 'filter']"></fa-icon></span>
        </button>
    </div>
    `
})
export class ToolbarButtonFiltersComponent {
  constructor() {}

  @Output() toggleFilters = new EventEmitter<any>();
}
