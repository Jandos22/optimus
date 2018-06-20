import { PeopleBuildUrlService } from './people-build-url.service';
import { PeopleService } from './people.service';
import { PeopleFormHttpService } from '../forms/people-form/form-services';

export const services: any[] = [
  PeopleService,
  PeopleBuildUrlService,
  PeopleFormHttpService
];

export * from './people.service';
export * from './people-build-url.service';
export * from '../forms/people-form/form-services';
