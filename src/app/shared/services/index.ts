import { AppsService } from './apps.service';
import { UserService } from './user.service';
import { PeopleLookupService } from './people-lookup.service';
import { UtilitiesService } from './utilities.service';
import { SearchUsersService } from './search-users.service';
import { FieldsLookupService } from './fields-lookup.service';
// import { ClientsLookupService } from './clients-lookup.service';

export const services: any[] = [
  AppsService,
  UserService,
  PeopleLookupService,
  UtilitiesService,
  SearchUsersService,
  FieldsLookupService
  // ClientsLookupService
];

export * from './apps.service';
export * from './user.service';
export * from './people-lookup.service';
export * from './utilities.service';
export * from './search-users.service';
export * from './fields-lookup.service';
// export * from './clients-lookup.service';
