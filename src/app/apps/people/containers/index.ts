import { PeopleToolbarComponent } from './people-toolbar/people-toolbar.component';
import { PeopleComponent } from './people/people.component';
import { PeopleHeaderComponent } from './people-header/people-header.component';
import { PeopleContentComponent } from './people-content/people-content.component';
import { PeopleContentListComponent } from './people-content-list/people-content-list.component';
import { PeopleFooterComponent } from './people-footer/people-footer.component';
import { PeopleFiltersComponent } from './people-filters/people-filters.component';
import { PeopleFiltersHeaderComponent } from './people-filters/header/people-filters-header.component';
import { PeopleFiltersContentComponent } from './people-filters/content/people-filters-content.component';
import { PeopleFiltersFooterComponent } from './people-filters/footer/people-filters-footer.component';

export const containers: any[] = [
  PeopleComponent,
  PeopleHeaderComponent,
  PeopleContentComponent,
  PeopleContentListComponent,
  PeopleToolbarComponent,
  PeopleFooterComponent,
  PeopleFiltersComponent,
  PeopleFiltersHeaderComponent,
  PeopleFiltersContentComponent,
  PeopleFiltersFooterComponent
];

export * from './people/people.component';
export * from './people-toolbar/people-toolbar.component';
export * from './people-header/people-header.component';
export * from './people-content/people-content.component';
export * from './people-content-list/people-content-list.component';
export * from './people-footer/people-footer.component';
export * from './people-filters/people-filters.component';
export * from './people-filters/header/people-filters-header.component';
export * from './people-filters/content/people-filters-content.component';
export * from './people-filters/footer/people-filters-footer.component';
