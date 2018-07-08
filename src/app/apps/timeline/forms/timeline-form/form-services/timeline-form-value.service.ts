import { Injectable } from '@angular/core';

// interfaces
import { FormMode } from '../../../../../shared/interface/form.model';
import {
  PeopleItem,
  PeopleItemObject
} from '../../../../../shared/interface/people.model';

@Injectable()
export class TimelineFormValueService {
  constructor() {}

  // initItemFromClass(mode: FormMode, item?: PeopleItem) {
  //   // if mode is new, then create object with default values
  //   if (mode === 'new') {
  //     return new PeopleItemObject();
  //   } else if (mode === 'view' || mode === 'edit') {
  //     return new PeopleItemObject(item);
  //   } else {
  //     console.log('error: mode is not correct ' + mode);
  //   }
  // }

  // most common field value initialization
  initFieldValue(mode: FormMode, value: any) {
    console.log(mode);
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value, disabled: true };
      case 'edit':
        return { value, disabled: false };
    }
  }

  // when form control need to stay disabled even in edit mode
  // fields like Alias, Email and Gin cannot be updated
  initDisabledFieldValue(mode: FormMode, value: any) {
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value, disabled: true };
      case 'edit':
        return { value, disabled: true };
    }
  }
}
