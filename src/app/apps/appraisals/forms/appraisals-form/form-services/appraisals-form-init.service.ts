import { Injectable } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import * as addDays from 'date-fns/add_days';
import * as startOfDay from 'date-fns/start_of_day';

import * as _ from 'lodash';

// services
import { ValidationService } from './../../../../../shared/validators/validation.service';

// interfaces
import { FormMode } from '../../../../../shared/interface/form.model';
import { AppraisalItem } from '../../../../../shared/interface/appraisals.model';

// constants
import { ApiPath, PathSlbSp } from '../../../../../shared/constants';

@Injectable()
export class AppraisalsFormInitService {
  constructor(private fb: FormBuilder) {}

  create_FormGroup_Fields(mo: FormMode, it: AppraisalItem, lo: number) {
    console.log('started creating form group');
    console.log(mo);
    console.log(it);
    console.log(lo);

    // all lookup fields have "Id" at the end
    return this.fb.group({
      Date: [this.getDate(mo, it), Validators.required],
      JobId: [this.getSimpleId(mo, it, 'JobId'), Validators.required],
      GivenForId: [this.getSimpleId(mo, it, 'GivenForId'), Validators.required],
      GivenById: [this.getSimpleId(mo, it, 'GivenById'), Validators.required],
      OverallPerformance: [
        this.getSimpleValue(mo, it, 'OverallPerformance', false),
        [Validators.required, Validators.maxLength(255)]
      ],
      FurtherDevelopment: [
        this.getSimpleValue(mo, it, 'FurtherDevelopment', false),
        Validators.maxLength(255)
      ],
      OperatorComments: [
        this.getSimpleValue(mo, it, 'OperatorComments', false),
        Validators.maxLength(255)
      ],
      Safety: [
        this.getSimpleValue(mo, it, 'Safety', false),
        Validators.required
      ],
      SafetyDetails: [
        this.getSimpleValue(mo, it, 'SafetyDetails', false),
        [
          Validators.required,
          // Validators.minLength(22),
          Validators.maxLength(255)
        ]
      ],
      Proactivity: [
        this.getSimpleValue(mo, it, 'Proactivity', true),
        Validators.required
      ],
      ProactivityDetails: [
        this.getSimpleValue(mo, it, 'ProactivityDetails', true),
        [
          Validators.required,
          // Validators.minLength(22),
          Validators.maxLength(255)
        ]
      ],
      Quality: [this.getSimpleValue(mo, it, 'Quality'), Validators.required],
      QualityDetails: [
        this.getSimpleValue(mo, it, 'QualityDetails'),
        [
          Validators.required,
          // Validators.minLength(22),
          Validators.maxLength(255)
        ]
      ],
      WinchDriving: [
        this.getSimpleValue(mo, it, 'WinchDriving'),
        Validators.required
      ],
      WinchDrivingDetails: [
        this.getSimpleValue(mo, it, 'WinchDrivingDetails'),
        [Validators.required, Validators.maxLength(255)]
      ],
      DidRopeSocket: this.getSimpleBooleen(mo, it, 'DidRopeSocket'),
      DidRopeSocketH2S: this.getSimpleBooleen(mo, it, 'DidRopeSocketH2S'),
      DidCollector: this.getSimpleBooleen(mo, it, 'DidCollector'),
      DidHead: this.getSimpleBooleen(mo, it, 'DidHead'),
      LocationId: [this.getLocationId(mo, it, lo), Validators.required]
    });
  }

  // get field value & condition
  getSimpleValue(
    mode: FormMode,
    item: AppraisalItem,
    field: string,
    disabled?: boolean
  ) {
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value: item[field], disabled: true };
      case 'edit':
        return { value: item[field], disabled };
    }
  }

  // get field value & condition
  getSimpleBooleen(mode: FormMode, item: AppraisalItem, field: string) {
    switch (mode) {
      case 'new':
        return false;
      case 'view':
        const valueView = item[field] === null ? false : item[field];
        return valueView;
      case 'edit':
        const valueEdit = item[field] === null ? false : item[field];
        return valueEdit;
    }
  }

  getSimpleId(mode: FormMode, item: AppraisalItem, control: string) {
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value: item[control], disabled: true };
      case 'edit':
        return { value: item[control], disabled: false };
    }
  }

  getDate(mode: FormMode, item: AppraisalItem) {
    switch (mode) {
      case 'new':
        return { value: startOfDay(new Date()), disabled: false };
      case 'view':
        return { value: new Date(item.Date), disabled: true };
      case 'edit':
        return { value: new Date(item.Date), disabled: false };
    }
  }

  getLocationId(mode: FormMode, item: AppraisalItem, locationId: number) {
    switch (mode) {
      case 'new':
        return locationId; // Default location is locationAssignedId
      case 'view':
        return item.LocationId;
      case 'edit':
        return item.LocationId;
    }
  }
}
