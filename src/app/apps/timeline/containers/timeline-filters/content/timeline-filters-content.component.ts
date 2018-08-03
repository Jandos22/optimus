// core
import { Component, Input } from '@angular/core';

// forms
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-timeline-filters-content',
  styleUrls: ['timeline-filters-content.component.scss'],
  template: `
    <div class="filters-content-container">
        <app-timeline-filters-locations
            [fg_filters]="fg_filters" [locofinterest]="locofinterest">
        </app-timeline-filters-locations>
    </div>
    `
})
export class TimelineFiltersContentComponent {
  @Input() fg_filters: FormGroup;
  @Input() locofinterest: number[];
  constructor() {}
}
