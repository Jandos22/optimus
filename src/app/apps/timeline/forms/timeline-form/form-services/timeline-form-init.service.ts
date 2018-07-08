import { Injectable } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

// services
// import { ValidationService } from './../../../../../validators/validation.service';

// interfaces
import { FormMode } from '../../../../../shared/interface/form.model';
import { TimelineEventItem } from '../../../../../shared/interface/timeline.model';

// constants
import { ApiPath, PathSlbSp } from '../../../../../shared/constants';

@Injectable()
export class TimelineFormInitService {
  constructor() {}

  create_FormGroup_Fields(mo: FormMode, it: TimelineEventItem, lo: number) {
    return new FormGroup({
      Title: new FormControl(this.getSimpleFormValue(mo, it, 'Title'), [
        Validators.required,
        Validators.minLength(30),
        Validators.maxLength(70)
      ]),
      Summary: new FormControl(this.getSimpleFormValue(mo, it, 'Summary'), [
        Validators.required,
        Validators.minLength(60),
        Validators.maxLength(140)
      ]),
      RichText: new FormControl(this.getRichText(mo, it)),
      EventTypeId: new FormControl(
        this.getEventTypeId(mo, it),
        Validators.required
      ),
      EventDate: new FormControl(
        this.getEventDate(mo, it),
        Validators.required
      ),
      LocationsId: new FormControl(
        this.getLocationsId(mo, it, lo),
        Validators.required
      ),
      EventReportersId: new FormControl(
        this.getEventReportersId(mo, it),
        Validators.required
      )
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
  getEventTypeId(mode: FormMode, item: TimelineEventItem) {
    switch (mode) {
      case 'new':
        return 3; // Default Event Type = General, its id = 3
      case 'view':
        return { value: item.EventTypeId, disabled: true };
      case 'edit':
        return { value: item.EventTypeId, disabled: false };
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
        return { value: item.LocationsId, disabled: true };
      case 'edit':
        return { value: item.LocationsId, disabled: false };
    }
  }

  // get event type field value & condition
  getEventReportersId(mode: FormMode, item: TimelineEventItem) {
    switch (mode) {
      case 'new':
        return []; // Default Event Type = General, its id = 3
      case 'view':
        return { value: item.EventReportersId, disabled: true };
      case 'edit':
        return { value: item.EventReportersId, disabled: false };
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
