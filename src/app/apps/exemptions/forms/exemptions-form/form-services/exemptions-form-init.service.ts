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
import { ExemptionItem } from '../../../../../shared/interface/exemptions.model';

// constants
import { ApiPath, PathSlbSp } from '../../../../../shared/constants';

@Injectable()
export class ExemptionsFormInitService {
  constructor(private fb: FormBuilder) {}

  create_FormGroup_Fields(mo: FormMode, it: ExemptionItem, lo: number) {
    return this.fb.group({
      ExpiryDate: [this.getExpiryDate(mo, it), Validators.required],
      Status: [this.getSimpleFormValue(mo, it, 'Status'), Validators.required],
      PendingActions: [this.getSimpleFormValue(mo, it, 'PendingActions')],
      Title: [
        this.getSimpleFormValue(mo, it, 'Title'),
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(70)
        ]
      ],
      Summary: [
        this.getSimpleFormValue(mo, it, 'Summary'),
        [
          Validators.required,
          Validators.minLength(60),
          Validators.maxLength(255)
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
      SubmitterId: [this.getSubmitterId(mo, it), Validators.required]
    });
  }

  // get field value & condition
  getSimpleFormValue(mode: FormMode, item: ExemptionItem, field: string) {
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value: item[field], disabled: true };
      case 'edit':
        return { value: item[field], disabled: false };
    }
  }

  // get date field value (today) & condition
  getExpiryDate(mode: FormMode, item: ExemptionItem) {
    switch (mode) {
      case 'new':
        return { value: new Date(), disabled: true };
      case 'view':
        return { value: new Date(item.ExpiryDate), disabled: true };
      case 'edit':
        return { value: new Date(item.ExpiryDate), disabled: false };
    }
  }

  // get event type field value & condition
  getLocationId(mode: FormMode, item: ExemptionItem, locationId: number) {
    switch (mode) {
      case 'new':
        return locationId; // Default location is locationAssignedId
      case 'view':
        return item.LocationId;
      case 'edit':
        return item.LocationId;
    }
  }

  // get event type field value & condition
  getSubmitterId(mode: FormMode, item: ExemptionItem) {
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value: item.SubmitterId, disabled: true };
      case 'edit':
        return { value: item.SubmitterId, disabled: false };
    }
  }
}
