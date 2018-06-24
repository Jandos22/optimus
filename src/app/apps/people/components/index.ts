import { PeopleItemComponent } from './people-item/people-item.component';
import { PeopleSearchComponent } from './people-search/people-search.component';
import { PeopleTopSelectComponent } from './people-top-select/people-top-select.component';

export const components: any[] = [
  PeopleSearchComponent,
  PeopleTopSelectComponent,
  PeopleItemComponent
];

export * from './people-search/people-search.component';
export * from './people-top-select/people-top-select.component';
export * from './people-item/people-item.component';
