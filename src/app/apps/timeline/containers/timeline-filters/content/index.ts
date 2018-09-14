import { TimelineFiltersEventTypesComponent } from './event-types/timeline-filters-event-types.component';
import { TimelineFiltersEventTypesV2Component } from './event-types-v2/timeline-filters-event-types-v2.component';
// import { TimelineFiltersLocationsComponent } from './locations/timeline-filters-locations.component';

export const filters: any[] = [
  //   TimelineFiltersLocationsComponent,
  TimelineFiltersEventTypesComponent,
  TimelineFiltersEventTypesV2Component
];

// export * from './locations/timeline-filters-locations.component';
export * from './event-types/timeline-filters-event-types.component';
export * from './event-types-v2/timeline-filters-event-types-v2.component';
