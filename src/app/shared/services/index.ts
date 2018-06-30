import { UserService } from './user.service';
import { PeopleLookupService } from './people-lookup.service';
import { UtilitiesService } from './utilities.service';

export const services: any[] = [
  UserService,
  PeopleLookupService,
  UtilitiesService
];

export * from './user.service';
export * from './people-lookup.service';
export * from './utilities.service';
