import { KaizenComponent } from './kaizen/kaizen.component';
import { KaizenHeaderComponent } from './kaizen-header/kaizen-header.component';
import { KaizenProjectsListComponent } from './kaizen-projects-list/kaizen-projects-list.component';
import { KaizenFooterComponent } from './kaizen-footer/kaizen-footer.component';
import { KaizenToolbarComponent } from './kaizen-toolbar/kaizen-toolbar.component';

export const containers: any[] = [
  KaizenComponent,
  KaizenHeaderComponent,
  KaizenToolbarComponent,
  KaizenProjectsListComponent,
  KaizenFooterComponent
];

export * from './kaizen/kaizen.component';
export * from './kaizen-header/kaizen-header.component';
export * from './kaizen-toolbar/kaizen-toolbar.component';
export * from './kaizen-projects-list/kaizen-projects-list.component';
export * from './kaizen-footer/kaizen-footer.component';
