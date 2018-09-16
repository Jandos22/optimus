import { TimelineFiltersEventTypesComponent } from './event-types/timeline-filters-event-types.component';
import { TimelineFiltersEventTypesV2Component } from './event-types-v2/timeline-filters-event-types-v2.component';
import { TimelineFiltersIssueStateComponent } from './issue-state/timeline-filters-issue-state.component';

export const filters: any[] = [
  TimelineFiltersEventTypesComponent,
  TimelineFiltersEventTypesV2Component,
  TimelineFiltersIssueStateComponent
];

export * from './event-types/timeline-filters-event-types.component';
export * from './event-types-v2/timeline-filters-event-types-v2.component';
export * from './issue-state/timeline-filters-issue-state.component';
