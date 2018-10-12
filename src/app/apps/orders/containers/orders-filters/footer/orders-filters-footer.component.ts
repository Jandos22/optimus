import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-orders-filters-footer',
  styleUrls: ['orders-filters-footer.component.scss'],
  template: `
    <div class="filters-footer-container"
      fxLayout="row nowrap" fxLayoutAlign="end center">

      <button
        mat-button
        matTooltip='reset filters'
        matTooltipClass='mytooltip large-text'
        (click)="onResetFilters.emit()">
        RESET
      </button>

      <button
        mat-button
        matTooltip='hide filters'
        matTooltipClass='mytooltip large-text'
        (click)="toggleFilters.emit()">
        HIDE
      </button>
    </div>
    `
})
export class OrdersFiltersFooterComponent {
  @Output()
  onResetFilters = new EventEmitter<any>();
  @Output()
  toggleFilters = new EventEmitter<any>();
  constructor() {}
}
