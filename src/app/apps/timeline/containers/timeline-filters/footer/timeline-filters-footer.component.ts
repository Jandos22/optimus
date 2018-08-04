import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline-filters-footer',
  styleUrls: ['timeline-filters-footer.component.scss'],
  template: `
    <div class="filters-footer-container"
      fxLayout="row nowrap" fxLayoutAlign="end center">
      <button mat-button>RESET</button>
    </div>
    `
})
export class TimelineFiltersFooterComponent {
  constructor() {}
}
