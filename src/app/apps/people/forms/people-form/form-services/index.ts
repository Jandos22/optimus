import { PeopleFormPhotoService } from './people-form-photo.service';
import { PeopleFormValueService } from './people-form-value.service';
// import { PeopleFormSizeService } from './people-form-size.service';
import { PeopleFormInitService } from './people-form-init.service';
import { PeopleFormHttpService } from './people-form-http.service';

export const form_services: any[] = [
  PeopleFormInitService,
  // PeopleFormSizeService,
  PeopleFormValueService,
  PeopleFormHttpService,
  PeopleFormPhotoService
];

export * from './people-form-value.service';
// export * from './people-form-size.service';
export * from './people-form-init.service';
export * from './people-form-http.service';
export * from './people-form-photo.service';
