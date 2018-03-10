import { UsersService } from './users.service';
import { PeopleService } from './people.service';

export const services: any[] = [UsersService, PeopleService];

export * from './users.service';
export * from './people.service';
