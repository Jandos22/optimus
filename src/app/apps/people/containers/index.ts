import { PeopleToolbarComponent } from './people-toolbar/people-toolbar.component';
import { PeopleComponent } from './people/people.component';
import { PeopleHeaderComponent } from './people-header/people-header.component';
import { PeopleContentComponent } from './people-content/people-content.component';
import { PeopleContentListComponent } from './people-content-list/people-content-list.component';
import { PeopleFooterComponent } from './people-footer/people-footer.component';

export const containers: any[] = [
  PeopleComponent,
  PeopleHeaderComponent,
  PeopleContentComponent,
  PeopleContentListComponent,
  PeopleToolbarComponent,
  PeopleFooterComponent
];

export * from './people/people.component';
export * from './people-toolbar/people-toolbar.component';
export * from './people-header/people-header.component';
export * from './people-content/people-content.component';
export * from './people-content-list/people-content-list.component';
export * from './people-footer/people-footer.component';
