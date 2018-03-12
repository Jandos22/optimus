import { PeopleToolbarBottomComponent } from './people-toolbar-bottom/people-toolbar-bottom.component';
import { PeopleToolbarComponent } from './people-toolbar/people-toolbar.component';
import { PeopleComponent } from './people/people.component';
import { PeopleListComponent } from './people-list/people-list.component';

export const containers: any[] = [
  PeopleComponent,
  PeopleListComponent,
  PeopleToolbarComponent,
  PeopleToolbarBottomComponent
];

export * from './people/people.component';
export * from './people-list/people-list.component';
export * from './people-toolbar/people-toolbar.component';
export * from './people-toolbar-bottom/people-toolbar-bottom.component';
