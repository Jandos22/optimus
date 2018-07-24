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
import { JobItem } from '../../../../../shared/interface/jobs.model';

// constants
import { ApiPath, PathSlbSp } from '../../../../../shared/constants';

@Injectable()
export class JobsFormInitService {
  constructor(private fb: FormBuilder) {}

  create_FormGroup_Fields(mo: FormMode, it: JobItem, lo: number) {
    // create section with titles and bodies
    const summarySections = this.getSummarySections(mo, it, 2);

    return this.fb.group({
      Title: [
        this.getSimpleFormValue(mo, it, 'Title'),
        [Validators.required, Validators.maxLength(140)]
      ],
      iDistrict: [
        this.getSimpleFormValue(mo, it, 'iDistrict'),
        Validators.required
      ],
      Well: [this.getSimpleFormValue(mo, it, 'Well'), Validators.required],
      RigUpStart: [this.getRigUpStartDate(mo, it), Validators.required],
      RigUpEnd: [this.getRigUpEndDate(mo, it), Validators.required],
      JobDuration: [this.getJobDuration(mo, it), Validators.required],
      SummarySections: [this.getSummarySectionsCount(mo, it)],
      ...summarySections,
      LocationId: [this.getLocationId(mo, it, lo), Validators.required]
    });
  }

  getSummarySectionsCount(mode: FormMode, item: JobItem) {
    switch (mode) {
      case 'new':
        return 1;
      case 'view':
        return item['SummarySections'];
      case 'edit':
        return item['SummarySections'];
    }
  }

  getSummarySections(mo: FormMode, it: JobItem, sections: number) {
    const max70 = [Validators.maxLength(70)];
    const max255 = [Validators.maxLength(255)];

    const titles: any[] = _.times(sections, (i: number) => {
      const n = i + 1;
      return [
        'JSStitle' + n,
        [this.getSimpleFormValue(mo, it, 'JSStitle' + n), max70]
      ];
    });

    const bodies: any[] = _.times(2, (i: number) => {
      const n = i + 1;
      return [
        ['JSSbody' + n],
        [this.getSimpleFormValue(mo, it, 'JSSbody' + n), max70]
      ];
    });

    const mergedTitles = _.fromPairs(titles);
    const mergedBodies = _.fromPairs(bodies);

    return { ...mergedTitles, ...mergedBodies };
  }

  // get field value & condition
  getSimpleFormValue(mode: FormMode, item: JobItem, field: string) {
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
  getRigUpStartDate(mode: FormMode, item: JobItem) {
    switch (mode) {
      case 'new':
        return { value: startOfDay(new Date()), disabled: false };
      case 'view':
        return { value: new Date(item.RigUpStart), disabled: true };
      case 'edit':
        return { value: new Date(item.RigUpStart), disabled: false };
    }
  }

  // get date field value (today) & condition
  getRigUpEndDate(mode: FormMode, item: JobItem) {
    switch (mode) {
      case 'new':
        // add 1 day for today
        return { value: addDays(startOfDay(new Date()), 1), disabled: false };
      case 'view':
        return { value: new Date(item.RigUpEnd), disabled: true };
      case 'edit':
        return { value: new Date(item.RigUpEnd), disabled: false };
    }
  }

  getJobDuration(mode: FormMode, item: JobItem) {
    switch (mode) {
      case 'new':
        return { value: '', disabled: true };
      case 'view':
        return { value: item.JobDuration, disabled: true };
      case 'edit':
        return { value: item.JobDuration, disabled: true };
    }
  }

  // get event type field value & condition
  getLocationId(mode: FormMode, item: JobItem, locationId: number) {
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
