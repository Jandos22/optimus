import { TimelineComponent } from './timeline/timeline.component';
import { TimelineHeaderComponent } from './timeline-header/timeline-header.component';
import { TimelineEventsListComponent } from './timeline-events-list/timeline-events-list.component';
import { TimelineFooterComponent } from './timeline-footer/timeline-footer.component';
import { TimelineToolbarComponent } from './timeline-toolbar/timeline-toolbar.component';

export const containers: any[] = [
  TimelineComponent,
  TimelineHeaderComponent,
  TimelineToolbarComponent,
  TimelineEventsListComponent,
  TimelineFooterComponent
];

export * from './timeline/timeline.component';
export * from './timeline-header/timeline-header.component';
export * from './timeline-toolbar/timeline-toolbar.component';
export * from './timeline-events-list/timeline-events-list.component';
export * from './timeline-footer/timeline-footer.component';
