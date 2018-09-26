// import { PeopleBuildUrlService } from './people-build-url.service';
import { PeopleService } from './people.service';
import { PeopleFormHttpService } from '../forms/people-form/form-services';
import { PeoplePositionsService } from './people-positions.service';
import { PeopleUrlParamsService } from './people-url-params.service';

export const services: any[] = [
  // PeopleService,
  PeopleFormHttpService,
  PeoplePositionsService,
  PeopleUrlParamsService
];

export * from './people.service';
export * from '../forms/people-form/form-services';
export * from './people-positions.service';
export * from './people-url-params.service';
