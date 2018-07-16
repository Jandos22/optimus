import { Injectable } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

// services
// import { ValidationService } from './../../../../../shared/validators/validation.service';

// interfaces
import { FormMode } from '../../../../../shared/interface/form.model';
import { TimelineEventItem } from '../../../../../shared/interface/timeline.model';

// constants
import { ApiPath, PathSlbSp } from '../../../../../shared/constants';

@Injectable()
export class TimelineFormInitService {
  constructor(private fb: FormBuilder) {}

  create_FormGroup_Fields(mo: FormMode, it: TimelineEventItem, lo: number) {
    return this.fb.group({
      Title: [
        this.getSimpleFormValue(mo, it, 'Title'),
        [
          Validators.required,
          Validators.minLength(30),
          Validators.maxLength(70)
        ]
      ],
      Summary: [
        this.getSimpleFormValue(mo, it, 'Summary'),
        [
          Validators.required,
          Validators.minLength(60),
          Validators.maxLength(140)
        ]
      ],
      HashTags: [
        this.getSimpleFormValue(mo, it, 'HashTags'),
        [Validators.maxLength(140)]
      ],
      RichText: [this.getRichText(mo, it)],
      EventTypeId: [this.getEventTypeId(mo, it), Validators.required],
      EventDate: [this.getEventDate(mo, it), Validators.required],
      LocationsId: this.fb.group({
        results: [this.getLocationsId(mo, it, lo), Validators.required]
      }),
      EventReportersId: this.fb.group({
        results: [this.getEventReportersId(mo, it), Validators.required]
      })
    });
  }

  create_FormGroup_Image(mo: FormMode, it: TimelineEventItem) {
    if (mo === 'new') {
      return new FormGroup({
        ID: new FormControl(''),
        ImageUrl: new FormControl(''),
        ArrayBuffer: new FormControl(new ArrayBuffer(0))
      });
    } else {
      return new FormGroup({
        ID: new FormControl(it.ID),
        ImageUrl: new FormControl(this.getImageUrl(it)),
        ArrayBuffer: new FormControl(new ArrayBuffer(0))
      });
    }
  }

  getImageUrl(item: TimelineEventItem) {
    // check if item has attachments
    if (item.Attachments) {
      // if running in dev mode then prepend prefix path
      const url = ApiPath.startsWith('_') ? PathSlbSp : '';
      // image url will be the first attachment file
      return url + item.AttachmentFiles.results[0].ServerRelativeUrl;
    } else {
      return '';
    }
  }

  // get field value & condition
  getSimpleFormValue(mode: FormMode, item: TimelineEventItem, field: string) {
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value: item[field], disabled: true };
      case 'edit':
        return { value: item[field], disabled: false };
    }
  }

  // get event type field value & condition
  // setting disabled via form builder doesn't work
  // on mat-select fields, so disable them via attribute
  getEventTypeId(mode: FormMode, item: TimelineEventItem) {
    switch (mode) {
      case 'new':
        return 3; // Default Event Type = General, its id = 3
      case 'view':
        return item.EventTypeId;
      case 'edit':
        return item.EventTypeId;
    }
  }

  // get date field value (today) & condition
  getEventDate(mode: FormMode, item: TimelineEventItem) {
    switch (mode) {
      case 'new':
        return { value: new Date(), disabled: true };
      case 'view':
        return { value: new Date(item.EventDate), disabled: true };
      case 'edit':
        return { value: new Date(item.EventDate), disabled: false };
    }
  }

  // get event type field value & condition
  getLocationsId(mode: FormMode, item: TimelineEventItem, locationId: number) {
    switch (mode) {
      case 'new':
        return [locationId]; // Default Event Type = General, its id = 3
      case 'view':
        return item.LocationsId.results;
      case 'edit':
        return item.LocationsId.results;
    }
  }

  // get event type field value & condition
  getEventReportersId(mode: FormMode, item: TimelineEventItem) {
    switch (mode) {
      case 'new':
        return []; // Default Event Type = General, its id = 3
      case 'view':
        return { value: item.EventReportersId.results, disabled: true };
      case 'edit':
        return { value: item.EventReportersId.results, disabled: false };
    }
  }

  // get event rich text field value & condition
  getRichText(mode: FormMode, item: TimelineEventItem) {
    switch (mode) {
      case 'new':
        return ''; // start with empty string
      case 'view':
        return { value: item.RichText, disabled: true };
      case 'edit':
        return { value: item.RichText, disabled: false };
    }
  }
}
