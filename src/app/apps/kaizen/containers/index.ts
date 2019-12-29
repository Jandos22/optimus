import { KaizenComponent } from './kaizen/kaizen.component';
import { KaizenHeaderComponent } from './kaizen-header/kaizen-header.component';
import { KaizenProjectsListComponent } from './kaizen-projects-list/kaizen-projects-list.component';
import { KaizenFooterComponent } from './kaizen-footer/kaizen-footer.component';
import { KaizenToolbarComponent } from './kaizen-toolbar/kaizen-toolbar.component';
import { KaizenFiltersComponent } from './kaizen-filters/kaizen-filters.component';
import { KaizenFiltersHeaderComponent } from './kaizen-filters/header/kaizen-filters-header.component';
import { KaizenFiltersContentComponent } from './kaizen-filters/content/kaizen-filters-content.component';
import { KaizenFiltersFooterComponent } from './kaizen-filters/footer/kaizen-filters-footer.component';

export const containers: any[] = [
  KaizenComponent,
  KaizenHeaderComponent,
  KaizenToolbarComponent,
  KaizenProjectsListComponent,
  KaizenFooterComponent,
  KaizenFiltersComponent,
  KaizenFiltersContentComponent, 
  KaizenFiltersHeaderComponent,
  KaizenFiltersFooterComponent
];

export * from './kaizen/kaizen.component';
export * from './kaizen-header/kaizen-header.component';
export * from './kaizen-toolbar/kaizen-toolbar.component';
export * from './kaizen-projects-list/kaizen-projects-list.component';
export * from './kaizen-footer/kaizen-footer.component';
export * from './kaizen-filters/kaizen-filters.component';
export * from './kaizen-filters/header/kaizen-filters-header.component';
export * from './kaizen-filters/content/kaizen-filters-content.component';
export * from './kaizen-filters/footer/kaizen-filters-footer.component';
