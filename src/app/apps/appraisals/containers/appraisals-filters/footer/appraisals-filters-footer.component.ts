import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-appraisals-filters-footer',
  styleUrls: ['appraisals-filters-footer.component.scss'],
  template: `
    <div class="filters-footer-container"
      fxLayout="row nowrap" fxLayoutAlign="end center">
      <button mat-button matTooltip='reset filters' (click)="onResetFilters.emit()">RESET</button>
      <button mat-button matTooltip='hide filters' (click)="toggleFilters.emit()">HIDE</button>
    </div>
    `
})
export class AppraisalsFiltersFooterComponent {
  @Output()
  onResetFilters = new EventEmitter<any>();

  @Output()
  toggleFilters = new EventEmitter<any>();

  constructor() {}
}
