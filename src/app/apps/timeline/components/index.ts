import { TimelineToolbarButtonMenuComponent } from './toolbar-button-menu/timeline-toolbar-button-menu.component';
import { TimelineEventComponent } from './timeline-event/timeline-event.component';
import { TimelineEventReportersComponent } from './timeline-event-reporters/timeline-event-reporters.component';
import { TimelineToolbarButtonAddComponent } from './toolbar-button-add/timeline-toolbar-button-add.component';
import { TimelineToolbarInputSearchComponent } from './toolbar-input-search/timeline-toolbar-input-search.component';
// import { TimelineToolbarButtonFiltersComponent } from './toolbar-button-filters/timeline-toolbar-button-filters.component';
import { TimelineToolbarButtonClearComponent } from './toolbar-button-clear/timeline-toolbar-button-clear.component';
import { TimelineEventHasImageComponent } from './timeline-event-has-image/timeline-event-has-image.component';
import { TimelineEventNoImageComponent } from './timeline-event-no-image/timeline-event-no-image.component';
import { TimelineEventReporters2Component } from './timeline-event-reporters-2/timeline-event-reporters-2.component';

export const components: any[] = [
  TimelineEventComponent,
  TimelineEventHasImageComponent,
  TimelineEventNoImageComponent,
  TimelineEventReportersComponent,
  TimelineEventReporters2Component,
  TimelineToolbarButtonMenuComponent,
  TimelineToolbarInputSearchComponent,
  TimelineToolbarButtonAddComponent,
  // TimelineToolbarButtonFiltersComponent,
  TimelineToolbarButtonClearComponent
];

export * from './timeline-event/timeline-event.component';
export * from './timeline-event-has-image/timeline-event-has-image.component';
export * from './timeline-event-no-image/timeline-event-no-image.component';
export * from './timeline-event-reporters/timeline-event-reporters.component';
export * from './toolbar-button-add/timeline-toolbar-button-add.component';
// export * from './toolbar-button-filters/timeline-toolbar-button-filters.component';
export * from './toolbar-button-menu/timeline-toolbar-button-menu.component';
export * from './toolbar-input-search/timeline-toolbar-input-search.component';
export * from './toolbar-button-clear/timeline-toolbar-button-clear.component';
export * from './timeline-event-reporters-2/timeline-event-reporters-2.component';
