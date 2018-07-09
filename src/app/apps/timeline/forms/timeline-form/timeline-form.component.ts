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
import { TimelineFormHttpService } from './form-services/timeline-form-http.service';

// interfaces
import {
  TimelineEventItem,
  TimelineEventType
} from '../../../../shared/interface/timeline.model';
import { FormMode } from '../../../../shared/interface/form.model';
import { SpListItemAttachmentFiles } from '../../../../shared/interface/sp-list-item.model';
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-timeline-form',
  styleUrls: ['timeline-form.component.scss'],
  templateUrl: './timeline-form.component.html',
  providers: [TimelineFormHttpService, TimelineFormInitService]
})
export class TimelineFormComponent implements OnInit, OnDestroy {
  // form shall have only two form groups
  // which are initialized immediately in class constructor
  fg_fields: FormGroup;
  fg_image: FormGroup;

  accessLevel$: Observable<number>;

  $locationAssignedId: Subscription;
  locationAssignedId: number;

  // form title
  Title: string;

  // get self optimus account
  selfUser$: Observable<PeopleItem>;

  // subscribe to window from root store
  // used to update form size dynamically
  $window: Subscription;

  // selectables
  eventTypes$: Observable<TimelineEventType[]>;
  locations$: Observable<LocationEnt[]>;

  // Form Mode is Subject
  $mode: Subject<FormMode>;

  // focuses
  rte_focused = false;

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

    this.setupSubscriptions();
    this.setupObservables();

    this.$mode.next(this.data.mode);
  }

  setupSubscriptions() {
    // all subscriptions start with $ prefix
    // this helps quickly check if all been unsubscribed

    // $$$ when Form Mode changes initialize form groups
    this.$mode.subscribe(mode => {
      console.log('mode changed to: ' + mode);
      this.data.mode = mode;
      console.log(this.data.item);

      this.createFormGroups(mode, this.data.item, this.locationAssignedId);
    });

    // $$$ on each breakpoint change, update size of form dialog
    this.$window = this.store_root
      .select(fromRoot.getLayoutWindow)
      .subscribe(window => {
        // this.formRef.updateSize(this.formSizeService.width(window));
      });
  }

  setupObservables() {
    // list of component life long observables
    // all observables end with $ suffix

    // get self user item to use in event reporters selection
    this.selfUser$ = this.store_root.pipe(select(fromRoot.getUserOptimus));

    // get and observe user's access level
    this.accessLevel$ = this.store_root.pipe(
      select(fromRoot.getUserAccessLevel)
    );

    // get selectable event types
    this.eventTypes$ = this.store_root.pipe(
      select(fromTimeline.getApplicableEventTypes)
    );

    // get user's location assigned id
    this.$locationAssignedId = this.store_root
      .pipe(select(fromRoot.getUserLocationAssignedId))
      .subscribe(locationId => (this.locationAssignedId = locationId));

    // get selectable locations
    this.locations$ = this.store_root.select(fromRoot.selectAllLocations);
  }

  createFormGroups(m: FormMode, it: TimelineEventItem, lo: number) {
    // create 2 form groups
    this.fg_fields = this.formInitService.create_FormGroup_Fields(m, it, lo);
    this.fg_image = this.formInitService.create_FormGroup_Image(m, it);

    console.log('created 2 form groups:');
    console.log(this.fg_fields);
    console.log(this.fg_image);
  }

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

  // @Output from FormControlImagePicker
  imageChanged(ArrayBuffer: ArrayBuffer) {
    this.fg_image.get('ArrayBuffer').patchValue(ArrayBuffer);
    // this.unsavedPhoto = { hasUnsavedPhoto: true, ...newPhoto };
  }

  onSelectUser(selected: number[]) {
    this.fg_fields
      .get('EventReportersId')
      .get('results')
      .patchValue(selected);
  }

  onRichTextFocus(event) {
    this.rte_focused = event;
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
  }
}
