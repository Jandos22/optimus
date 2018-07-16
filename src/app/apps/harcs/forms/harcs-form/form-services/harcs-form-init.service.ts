import { Injectable } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

// services
import { ValidationService } from './../../../../../shared/validators/validation.service';

// interfaces
import { FormMode } from '../../../../../shared/interface/form.model';
import { HarcItem } from '../../../../../shared/interface/harcs.model';

// constants
import { ApiPath, PathSlbSp } from '../../../../../shared/constants';

@Injectable()
export class HarcsFormInitService {
  constructor(private fb: FormBuilder) {}

  create_FormGroup_Fields(mo: FormMode, it: HarcItem, lo: number) {
    return this.fb.group({
      ExpiryDate: [this.getExpiryDate(mo, it), Validators.required],
      Status: [this.getSimpleFormValue(mo, it, 'Status'), Validators.required],
      PendingActions: [this.getSimpleFormValue(mo, it, 'PendingActions')],
      Title: [
        this.getSimpleFormValue(mo, it, 'Title'),
        [
          Validators.required,
          Validators.minLength(30),
          Validators.maxLength(70)
        ]
      ],
      HashTags: [
        this.getSimpleFormValue(mo, it, 'HashTags'),
        [Validators.maxLength(140)]
      ],
      QuestNumber: [
        this.getSimpleFormValue(mo, it, 'QuestNumber'),
        [
          Validators.minLength(14),
          Validators.maxLength(14),
          ValidationService.onlyNumbers
        ]
      ],
      QuestQPID: [
        this.getSimpleFormValue(mo, it, 'QuestQPID'),
        [
          Validators.minLength(6),
          Validators.maxLength(6),
          ValidationService.onlyNumbers
        ]
      ],
      LocationId: [this.getLocationId(mo, it, lo), Validators.required],
      PICId: [this.getPICId(mo, it), Validators.required]
    });
  }

  // get field value & condition
  getSimpleFormValue(mode: FormMode, item: HarcItem, field: string) {
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value: item[field], disabled: true };
      case 'edit':
        return { value: item[field], disabled: false };
    }
  }

  getExpiryDate(mode: FormMode, item: HarcItem) {
    switch (mode) {
      case 'new':
        return { value: new Date(), disabled: true };
      case 'view':
        return { value: new Date(item.ExpiryDate), disabled: true };
      case 'edit':
        return { value: new Date(item.ExpiryDate), disabled: false };
    }
  }

  getLocationId(mode: FormMode, item: HarcItem, locationId: number) {
    switch (mode) {
      case 'new':
        return locationId; // Default location is locationAssignedId
      case 'view':
        return item.LocationId;
      case 'edit':
        return item.LocationId;
    }
  }

  getPICId(mode: FormMode, item: HarcItem) {
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value: item.PICId, disabled: true };
      case 'edit':
        return { value: item.PICId, disabled: false };
    }
  }
}
