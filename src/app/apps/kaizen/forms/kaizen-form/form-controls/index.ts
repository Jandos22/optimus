import { KaizenFormProjectDateComponent } from './kaizen-form-project-date/kaizen-form-project-date.component';
import { KaizenFormProjectTypeComponent } from './kaizen-form-project-type/kaizen-form-project-type.component';
import { KaizenFormValueCreationComponent } from './kaizen-form-value-creation/kaizen-form-value-creation.component';
import { KaizenFormImpactTypeComponent } from './kaizen-form-impact-type/kaizen-form-impact-type.component';

export const forms_controls: any[] = [
  KaizenFormProjectDateComponent,
  KaizenFormProjectTypeComponent,
  KaizenFormImpactTypeComponent,
  KaizenFormValueCreationComponent
];

export * from './kaizen-form-project-date/kaizen-form-project-date.component';
export * from './kaizen-form-project-type/kaizen-form-project-type.component';
export * from './kaizen-form-value-creation/kaizen-form-value-creation.component';
export * from './kaizen-form-impact-type/kaizen-form-impact-type.component';
