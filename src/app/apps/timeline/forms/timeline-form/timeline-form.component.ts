import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

// constants
import {
  PathSlbSp,
  WirelinePath,
  PathOptimus
} from '../../../../shared/constants';

import { FormGroup } from '@angular/forms';

// rxjs
import { Subscription, Observable, Subject } from 'rxjs';

import {
  map,
  tap,
  switchMap,
  take,
  filter,
  pluck,
  takeUntil
} from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromTimeline from '../../store';

// material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// form services
import { TimelineFormInitService } from './form-services/timeline-form-init.service';
import { TimelineFormValueService } from './form-services/timeline-form-value.service';
// import { TimelineFormSizeService } from './form-services/timeline-form-size.service';
// import { TimelineFormPhotoService } from './form-services/timeline-form-photo.service';
// import { TimelineFormHttpService } from './form-services/timeline-form-http.service';

// dialog components
// import {
// TimelineFormPhotoPickerComponent,
// UserPhotoState
// } from '../timeline-form-photo-picker/timeline-form-photo-picker.component';

// interfaces
import { TimelineEventItem, TimelineEventType } from '../../../../shared/interface/timeline.model';
import { FormMode } from '../../../../shared/interface/form.model';
import { SpListItemAttachmentFiles } from '../../../../shared/interface/sp-list-item.model';
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-timeline-form',
  styleUrls: ['timeline-form.component.scss'],
  templateUrl: './timeline-form.component.html',
  providers: [
    TimelineFormInitService,
    TimelineFormValueService
    //   TimelineFormSizeService,
    //   PeopleFormPhotoService,
    //   PeopleFormHttpService
  ]
})
export class TimelineFormComponent implements OnInit, OnDestroy {
  // form shall have only two form groups
  // which are initialized immediately in class constructor
  fg_fields: FormGroup;
  // fg_photo: FormGroup;

  accessLevel$: Observable<number>;
  $locationAssignedId: Subscription;
  locationAssignedId: number;

  // form title
  Title: string;

  // subscribe to window from root store
  // used to update form size dynamically
  $window: Subscription;

  // selectables
  eventTypes$: Observable<TimelineEventType[]>;
  locations$: Observable<LocationEnt[]>;

  // Form Mode is Subject
  $mode: Subject<FormMode>;

  // react to value changes in form
  alias$: Subscription;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_timeline: Store<fromTimeline.TimelineState>,
    private formInitService: TimelineFormInitService,
    public formRef: MatDialogRef<TimelineFormComponent>,
    // private formSizeService: PeopleFormSizeService,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: FormMode; item?: TimelineEventItem }
  ) {}

  ngOnInit() {
    this.$mode = new Subject<FormMode>();

    // when Form Mode changes initialize form groups
    this.$mode.subscribe(mode => {
      console.log('mode changed to: ' + mode);
      this.data.mode = mode;
      this.initialize_FormGroup_Fields(mode, this.data.item);
      // this.initialize_FormGroup_Photo(mode, this.data.item);
      // this.updateFormTitle(mode);
    });

    this.accessLevel$ = this.store_root.pipe(select(fromRoot.getUserAccessLevel));
    this.$locationAssignedId = this.store_root.pipe(select(fromRoot.getUserLocationAssignedId)).subscribe(
      locationId => this.locationAssignedId = locationId
    );

    // get selectables
    this.eventTypes$ = this.store_root.pipe(select(fromTimeline.getApplicableEventTypes));
    this.locations$ = this.store_root.select(fromRoot.selectAllLocations);

    this.$mode.next(this.data.mode);

    // on each breakpoint change, update size of form dialog
    this.$window = this.store_root
      .select(fromRoot.getLayoutWindow)
      .subscribe(window => {
        // this.formRef.updateSize(this.formSizeService.width(window));
      });
  }

  // *** form group for fields
  initialize_FormGroup_Fields(mode, item?) {
    this.fg_fields = this.formInitService.create_FormGroup_Fields(mode, item, this.locationAssignedId);
    console.log(this.fg_fields);
  }

  // // *** form group for photo
  // initialize_FormGroup_Photo(mode, item?) {
  //   console.log(mode);
  //   this.fg_photo = this.initFormService.create_FormGroup_Photo(mode, item);
  //   console.log(this.fg_photo);
  // }

  // // Utility Functions

  // updatePhotoFilename(): void {
  //   const alias: string = this.fg_fields.get('Alias').value;
  //   this.fg_photo.get('Filename').setValue(alias ? `${alias}.jpg` : '');
  // }

  // updateFormTitle(mode) {
  //   const name = this.fg_fields.get('Name').value;
  //   const surname = this.fg_fields.get('Surname').value;
  //   if (mode === 'new') {
  //     this.Title = 'New User';
  //   } else {
  //     this.Title = name + ' ' + surname;
  //   }
  // }

  switchFormMode(mode: FormMode) {
    this.$mode.next(mode);
  }

  // updateFormGroupFields(updatedFields: PeopleItem) {
  //   console.log(updatedFields);
  //   this.data.item = { ...this.data.item, ...updatedFields };
  // }

  // updateFormGroupPhoto(newPhoto: SpListItemAttachmentFiles[]) {
  //   console.log(this.data.item);
  //   console.log(newPhoto);
  //   this.data.item = {
  //     ...this.data.item,
  //     Attachments: true,
  //     AttachmentFiles: {
  //       results: { ...newPhoto }
  //     }
  //   };
  // }

  // // triggered from PeopleFormPhoto component
  // photoChanged(newPhoto: { PhotoUrl: string; ArrayBuffer: ArrayBuffer }) {
  //   this.fg_photo.get('PhotoUrl').patchValue(newPhoto.PhotoUrl);
  //   this.fg_photo.get('ArrayBuffer').patchValue(newPhoto.ArrayBuffer);
  //   // this.unsavedPhoto = { hasUnsavedPhoto: true, ...newPhoto };
  // }

  onSelectUser(selected: number[]) {
    this.fg_fields.get('EventReportersId').patchValue(selected);
  }

  closeForm($event) {
    this.formRef.close($event);
  }

  // unsubscribe from Subscription when component is destroyed
  ngOnDestroy() {
    // this.$$mode.unsubscribe();
    this.$window.unsubscribe();
    this.$locationAssignedId.unsubscribe();
    // this.$locations.unsubscribe();
    // this.alias$.unsubscribe();
  }
}
