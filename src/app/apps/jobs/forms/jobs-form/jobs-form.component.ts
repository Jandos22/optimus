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
  takeUntil,
  startWith
} from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromJobs from '../../store';

import * as _ from 'lodash';

// material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// form services
import { JobsFormInitService } from './form-services/jobs-form-init.service';
import { JobsFormHttpService } from './form-services/jobs-form-http.service';

// interfaces
import { JobItem } from '../../../../shared/interface/jobs.model';
import { FormMode } from '../../../../shared/interface/form.model';
import { SpListItemAttachmentFiles } from '../../../../shared/interface/sp-list-item.model';
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { PeopleItem } from '../../../../shared/interface/people.model';
import { ToolItem } from '../../../../shared/interface/tools.model';

// people group ids
import { people_op } from './../../../../shared/constants/ids-op';
import { people_fefs } from '../../../../shared/constants/ids-fefs';

@Component({
  selector: 'app-jobs-form',
  styleUrls: ['jobs-form.component.scss'],
  templateUrl: './jobs-form.component.html',
  providers: [JobsFormHttpService, JobsFormInitService]
})
export class JobsFormComponent implements OnInit, OnDestroy {
  // form shall have only two form groups
  // which are initialized immediately in class constructor
  fg_fields: FormGroup;

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
  locations$: Observable<LocationEnt[]>;
  toolNames$: Observable<ToolItem[]>;

  // Form Mode is Subject
  $mode: Subject<FormMode>;

  $summarySections: Subscription;
  summarySections: number[];

  engineers = people_fefs;
  operators = people_op;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_jobs: Store<fromJobs.JobsState>,
    private formInitService: JobsFormInitService,
    public formRef: MatDialogRef<JobsFormComponent>,
    // private formSizeService: PeopleFormSizeService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: FormMode; item?: JobItem }
  ) {}

  ngOnInit() {
    this.$mode = new Subject<FormMode>();

    this.setupSubscriptions();
    this.setupObservables();

    this.$mode.next(this.data.mode);

    // this.setupFormObservables();
  }

  setupSubscriptions() {
    // all subscriptions start with $ prefix
    // this helps quickly check if all been unsubscribed

    // $$$ when Form Mode changes initialize form groups
    this.$mode.subscribe(mode => {
      console.log('mode changed to: ' + mode);
      this.data.mode = mode;
      console.log('data item used:');
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

    // get self user item to use in project reporters selection
    this.selfUser$ = this.store_root.pipe(select(fromRoot.getUserOptimus));

    // get and observe user's access level
    this.accessLevel$ = this.store_root.pipe(
      select(fromRoot.getUserAccessLevel)
    );

    // get user's location assigned id
    this.$locationAssignedId = this.store_root
      .pipe(select(fromRoot.getUserLocationAssignedId))
      .subscribe(locationId => (this.locationAssignedId = locationId));

    // get selectable locations
    this.locations$ = this.store_root.select(fromRoot.selectAllLocations);

    // get selectable tool names
    this.toolNames$ = this.store_root.pipe(select(fromJobs.selectAllToolNames));
  }

  setupFormWatchers() {
    // this regulates how many job summary sections to show
    this.$summarySections = this.fg_fields.controls[
      'SummarySections'
    ].valueChanges
      .pipe(startWith(this.fg_fields.controls['SummarySections'].value))
      .subscribe(sections => {
        this.summarySections = _.times(sections, (i: number) => {
          return i + 1;
        });
        console.log(
          'summary sections count changed to: ' + this.summarySections
        );
      });
  }

  removeFormWatchers() {
    if (this.$summarySections) {
      this.$summarySections.unsubscribe();
    }
  }

  createFormGroups(m: FormMode, it: JobItem, lo: number) {
    // remove old form watchers if any
    this.removeFormWatchers();

    // create 1 form group
    this.fg_fields = this.formInitService.create_FormGroup_Fields(m, it, lo);

    console.log('created 1 form group:');
    console.log(this.fg_fields);

    console.log('refresh watchers of form group fields');
    this.setupFormWatchers();
  }

  switchFormMode(mode: FormMode) {
    this.$mode.next(mode);
  }

  // triggered after saving fields
  updateDataItem(updatedFields: JobItem) {
    console.log('updating data item:');
    console.log(updatedFields);

    this.data.item = { ...this.data.item, ...updatedFields };
  }

  // onSelectUser(selected: number[]) {
  //   // only one user allowed, so array should have 1 property
  //   this.fg_fields.get('SubmitterId').patchValue(selected[0]);
  // }

  onSelectEngineer(selected: number[]) {
    this.fg_fields
      .get('EngineersId')
      .get('results')
      .patchValue(selected);
  }

  onSelectOperator(selected: number[]) {
    this.fg_fields
      .get('OperatorsId')
      .get('results')
      .patchValue(selected);
  }

  closeForm($event) {
    this.formRef.close($event);
  }

  // unsubscribe from Subscription when component is destroyed
  ngOnDestroy() {
    this.$mode.unsubscribe();
    this.$window.unsubscribe();
    this.$locationAssignedId.unsubscribe();
  }
}
