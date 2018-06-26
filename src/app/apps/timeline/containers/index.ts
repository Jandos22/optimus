import { TimelineComponent } from './timeline/timeline.component';
import { TimelineToolbarComponent } from './timeline-toolbar/timeline-toolbar.component';
import { TimelineEventsListComponent } from './timeline-events-list/timeline-events-list.component';
import { TimelineFooterComponent } from './timeline-footer/timeline-footer.component';

export const containers: any[] = [
  TimelineComponent,
  TimelineToolbarComponent,
  TimelineEventsListComponent,
  TimelineFooterComponent
];

export * from './timeline/timeline.component';
export * from './timeline-toolbar/timeline-toolbar.component';
export * from './timeline-events-list/timeline-events-list.component';
export * from './timeline-footer/timeline-footer.component';
