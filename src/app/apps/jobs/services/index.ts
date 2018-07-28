import { JobsToolsService } from './jobs-tools.service';
import { JobsService } from './jobs.service';

export const services: any[] = [JobsService, JobsToolsService];

export * from './jobs.service';
export * from './jobs-tools.service';
