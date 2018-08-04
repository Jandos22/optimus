import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-jobs-filters-footer',
  styleUrls: ['jobs-filters-footer.component.scss'],
  template: `
    <div class="filters-footer-container"
      fxLayout="row nowrap" fxLayoutAlign="end center">
      <button mat-button (click)="onResetFilters.emit()">RESET</button>
    </div>
    `
})
export class JobsFiltersFooterComponent {
  @Output() onResetFilters = new EventEmitter<any>();
  constructor() {}
}
