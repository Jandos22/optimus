import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-harcs-filters-header',
  styleUrls: ['harcs-filters-header.component.scss'],
  template: `
    <div class="filters-toolbar-container"
        fxLayout="row nowrap" fxLayoutAlign="space-between center">
        <div fxFlex class="toolbar-title">Filters</div>
        <div class='common-button'>
            <button mat-icon-button matTooltip='hide filters'
                (click)="toggleFilters.emit()">
                <span class='fa_regular'><fa-icon [icon]="['fas', 'times']"></fa-icon></span>
            </button>
        </div>
    </div>
    `
})
export class HarcsFiltersHeaderComponent {
  constructor() {}

  @Output() toggleFilters = new EventEmitter<any>();
}
