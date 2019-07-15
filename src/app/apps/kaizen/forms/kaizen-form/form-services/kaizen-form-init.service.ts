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
import { KaizenProjectItem } from '../../../../../shared/interface/kaizen.model';

// constants
import { ApiPath, PathSlbSp } from '../../../../../shared/constants';

@Injectable()
export class KaizenFormInitService {
  constructor(private fb: FormBuilder) {}

  create_FormGroup_Fields(mo: FormMode, it: KaizenProjectItem, lo: number) {
    return this.fb.group({
      ProjectDate: [this.getProjectDate(mo, it), Validators.required],
      ProjectTypeId: this.fb.group({
        results: [this.getProjectTypeId(mo, it), Validators.required]
      }),
      ImpactTypeId: [this.getImpactTypeId(mo, it), Validators.required],
      ValueCreationForClient: [this.getValueCreationForClient(mo, it)],
      Title: [
        this.getSimpleFormValue(mo, it, 'Title'),
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(140)
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
      RichText: [this.getRichText(mo, it)],
      QuestRIR: [
        this.getSimpleFormValue(mo, it, 'QuestRIR'),
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
          Validators.maxLength(8),
          ValidationService.onlyNumbers
        ]
      ],
      LocationsId: this.fb.group({
        results: [this.getLocationsId(mo, it, lo), Validators.required]
      }),
      DoneById: this.fb.group({
        results: [this.getDoneById(mo, it), Validators.required]
      })
    });
  }

  create_FormGroup_Image(mo: FormMode, it: KaizenProjectItem) {
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

  getImageUrl(item: KaizenProjectItem) {
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
  getSimpleFormValue(mode: FormMode, item: KaizenProjectItem, field: string) {
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
  getProjectTypeId(mode: FormMode, item: KaizenProjectItem) {
    switch (mode) {
      case 'new':
        return [1]; // Default Project Type = SQ, its id = 1
      case 'view':
        return item.ProjectTypeId.results;
      case 'edit':
        return item.ProjectTypeId.results;
    }
  }

  getImpactTypeId(mode: FormMode, item: KaizenProjectItem) {
    switch (mode) {
      case 'new':
        return 1; // Default Impact Type = Small Improvement, its id = 1
      case 'view':
        return item.ImpactTypeId;
      case 'edit':
        return item.ImpactTypeId;
    }
  }

  // get date field value (today) & condition
  getProjectDate(mode: FormMode, item: KaizenProjectItem) {
    switch (mode) {
      case 'new':
        return { value: new Date(), disabled: false };
      case 'view':
        return { value: new Date(item.ProjectDate), disabled: true };
      case 'edit':
        return { value: new Date(item.ProjectDate), disabled: false };
    }
  }

  // get value creation field value & condition
  getValueCreationForClient(mode: FormMode, item: KaizenProjectItem) {
    switch (mode) {
      case 'new':
        return { value: 'false', disabled: true };
      case 'view':
        return { value: item.ValueCreationForClient, disabled: true };
      case 'edit':
        return { value: item.ValueCreationForClient, disabled: false };
    }
  }

  // get event type field value & condition
  getLocationsId(mode: FormMode, item: KaizenProjectItem, locationId: number) {
    switch (mode) {
      case 'new':
        return [locationId]; // Default Project Type = General, its id = 3
      case 'view':
        return item.LocationsId.results;
      case 'edit':
        return item.LocationsId.results;
    }
  }

  // get event type field value & condition
  getDoneById(mode: FormMode, item: KaizenProjectItem) {
    switch (mode) {
      case 'new':
        return []; // Default Project Type = General, its id = 3
      case 'view':
        return { value: item.DoneById.results, disabled: true };
      case 'edit':
        return { value: item.DoneById.results, disabled: false };
    }
  }

  // get event rich text field value & condition
  getRichText(mode: FormMode, item: KaizenProjectItem) {
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
