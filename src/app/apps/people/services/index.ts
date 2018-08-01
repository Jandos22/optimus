// import { PeopleBuildUrlService } from './people-build-url.service';
import { PeopleService } from './people.service';
import { PeopleFormHttpService } from '../forms/people-form/form-services';
import { PeoplePositionsService } from './people-positions.service';

export const services: any[] = [
  // PeopleService,
  PeopleFormHttpService,
  PeoplePositionsService
];

export * from './people.service';
// export * from './people-build-url.service';
export * from '../forms/people-form/form-services';
export * from './people-positions.service';
