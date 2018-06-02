import { PeopleModule } from './../people.module';
import { Injectable } from '@angular/core';

// interfaces
import { FormMode } from '../../../shared/interface/form-mode.model';
import {
  PeopleItem,
  PeopleItemObject
} from './../../../shared/interface/people.model';

@Injectable()
export class PeopleFormValueService {
  constructor() {}

  itemValue(data: {
    mode: 'new' | 'view' | 'edit' | string;
    item?: PeopleItem;
  }) {
    console.log(data);
    switch (data.mode) {
      case 'new':
        return new PeopleItemObject();

      case 'view':
        return new PeopleItemObject(data.item);

      case 'edit':
        return new PeopleItemObject(data.item);

      default:
        return new PeopleItemObject();
    }
  }

  initNameValue(mode: FormMode, value: any) {
    return mode.isNew
      ? ''
      : mode.isView
        ? { value, disabled: true }
        : { value, disabled: false };
  }

  initSurnameValue(mode: FormMode, value: any) {
    return mode.isNew ? '' : mode.isView ? { value, disabled: true } : value;
  }

  initAliasValue(mode: FormMode, value: any) {
    return mode.isNew
      ? ''
      : mode.isView || mode.isEdit
        ? { value, disabled: true }
        : null;
  }

  initEmailValue(mode: FormMode, value: any) {
    return mode.isNew
      ? { value: '@slb.com', disabled: true }
      : mode.isView || mode.isEdit
        ? { value, disabled: true }
        : null;
  }

  initGinValue(mode: FormMode, value: any) {
    return mode.isNew
      ? ''
      : mode.isView || mode.isEdit
        ? { value, disabled: true }
        : null;
  }

  initLocationAssignedIdValue(mode: FormMode, value: any) {
    return mode.isNew ? '' : mode.isView || mode.isEdit ? value : null;
  }
}
