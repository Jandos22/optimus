import { people_op } from './../../../../shared/constants/ids-op';
import { AppraisalRights } from './../../store/effects/rights.effects';
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ViewEncapsulation
} from '@angular/core';

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
import * as fromAppraisals from '../../store';

import * as _ from 'lodash';

// material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// form services
import { AppraisalsFormInitService } from './form-services/appraisals-form-init.service';
import { AppraisalsFormHttpService } from './form-services/appraisals-form-http.service';

// interfaces
import { AppraisalItem } from '../../../../shared/interface/appraisals.model';
import { FormMode } from '../../../../shared/interface/form.model';
import { SpListItemAttachmentFiles } from '../../../../shared/interface/sp-list-item.model';
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { PeopleItem } from '../../../../shared/interface/people.model';
import { people_fefs } from '../../../../shared/constants/ids-fefs';

@Component({
  selector: 'app-appraisals-form',
  styleUrls: ['appraisals-form.component.scss'],
  templateUrl: './appraisals-form.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [AppraisalsFormHttpService, AppraisalsFormInitService]
})
export class AppraisalsFormComponent implements OnInit, OnDestroy {
  // form shall have only two form groups
  // which are initialized immediately in class constructor
  fg_fields: FormGroup;

  accessLevel$: Observable<number>;
  includeOnlyOperators = people_op;
  includeOnlyEngineers = people_fefs;

  $locationAssignedId: Subscription;
  locationAssignedId: number;

  // get self optimus account
  selfUser$: Observable<PeopleItem>;
  position$: Observable<AppraisalRights>;
  isAppraisalAuthor: boolean;

  // selectables
  locations$: Observable<LocationEnt[]>;

  // Form Mode is Subject
  $mode: Subject<FormMode>;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_appraisals: Store<fromAppraisals.AppraisalsState>,
    private formInitService: AppraisalsFormInitService,
    public formRef: MatDialogRef<AppraisalsFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: FormMode; item?: AppraisalItem }
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
      console.log('data item used:');
      console.log(this.data.item);

      this.createFormGroups(mode, this.data.item, this.locationAssignedId);
    });
  }

  setupObservables() {
    // list of component life long observables
    // all observables end with $ suffix

    // get self user item to use in project reporters selection
    this.selfUser$ = this.store_root.pipe(
      select(fromRoot.getUserOptimus),
      // check if this appraisal is given by current user
      // so that only him/her can edit it
      tap((user: PeopleItem) => {
        if (this.data.mode === 'view') {
          this.isAppraisalAuthor = user.Id === this.data.item.GivenById;
        }
      })
    );

    // array of appraisal groups
    this.position$ = this.store_appraisals.pipe(
      select(fromAppraisals.getAppraisalPositionsCheck),
      tap(v => console.log(v))
    );

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
  }

  // setupFormWatchers() {}

  // removeFormWatchers() {}

  createFormGroups(m: FormMode, it: AppraisalItem, lo: number) {
    console.log('started creating form group');
    console.log(m);
    console.log(it);
    console.log(lo);

    // remove old form watchers if any
    // this.removeFormWatchers();

    // create 1 form group
    this.fg_fields = this.formInitService.create_FormGroup_Fields(m, it, lo);

    console.log('created 1 form group:');
    console.log(this.fg_fields);

    // console.log('refresh watchers of form group fields');
    // this.setupFormWatchers();
  }

  switchFormMode(mode: FormMode) {
    this.$mode.next(mode);
  }

  // triggered after saving fields
  updateDataItem(updatedFields: AppraisalItem) {
    console.log('updating data item:');
    console.log(updatedFields);

    this.data.item = { ...this.data.item, ...updatedFields };
  }

  // ids from people selector should always arrive as array of numbers
  // for single selections just select index 0
  onSelectGivenFor(selected: number[]) {
    this.fg_fields
      .get('GivenForId')
      // .get('results')
      .patchValue(selected[0]);
  }

  // ids from people selector should always arrive as array of numbers
  // for single selections just select index 0
  onSelectGivenBy(selected: number[]) {
    this.fg_fields
      .get('GivenById')
      // .get('results')
      .patchValue(selected[0]);
  }

  closeForm($event) {
    this.formRef.close($event);
  }

  // unsubscribe Subscriptions when component is destroyed
  ngOnDestroy() {
    this.$mode.unsubscribe();
    this.$locationAssignedId.unsubscribe();
  }
}
