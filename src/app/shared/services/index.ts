import { AppsService } from './apps.service';
import { UserService } from './user.service';
import { PeopleLookupService } from './people-lookup.service';
import { UtilitiesService } from './utilities.service';

export const services: any[] = [
  AppsService,
  UserService,
  PeopleLookupService,
  UtilitiesService
];

export * from './apps.service';
export * from './user.service';
export * from './people-lookup.service';
export * from './utilities.service';
