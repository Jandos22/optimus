import { KaizenService } from './kaizen.service';
import { KaizenProjectTypeService } from './kaizen-project-type.service';
import { KaizenImpactTypeService } from './kaizen-impact-type.service';

export const services: any[] = [
  KaizenService,
  KaizenProjectTypeService,
  KaizenImpactTypeService
];

export * from './kaizen.service';
export * from './kaizen-project-type.service';
export * from './kaizen-impact-type.service';
