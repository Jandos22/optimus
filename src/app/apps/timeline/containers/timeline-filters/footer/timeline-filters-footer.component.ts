import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-timeline-filters-footer',
  styleUrls: ['timeline-filters-footer.component.scss'],
  template: `
    <div class="filters-footer-container"
      fxLayout="row nowrap" fxLayoutAlign="end center">
      <button mat-button (click)="onResetFilters.emit()">RESET</button>
    </div>
    `
})
export class TimelineFiltersFooterComponent {
  @Output() onResetFilters = new EventEmitter<any>();
  constructor() {}
}
