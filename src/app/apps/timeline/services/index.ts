import { TimelineService } from './timeline.service';
import { TimelineTypeService } from './timeline-type.service';
import { TimelineUrlParamsService } from './timeline-url-params.service';

export const services: any[] = [
  TimelineService,
  TimelineTypeService,
  TimelineUrlParamsService
];

export * from './timeline.service';
export * from './timeline-type.service';
export * from './timeline-url-params.service';
