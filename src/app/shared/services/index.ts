import { UserService } from './user.service';
import { PeopleLookupService } from './people-lookup.service';

export const services: any[] = [UserService, PeopleLookupService];

export * from './user.service';
export * from './people-lookup.service';
