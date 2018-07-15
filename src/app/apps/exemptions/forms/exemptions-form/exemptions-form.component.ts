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
import * as fromExemptions from '../../store';

// material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// form services
import { ExemptionsFormInitService } from './form-services/exemptions-form-init.service';
import { ExemptionsFormHttpService } from './form-services/exemptions-form-http.service';

// interfaces
import { ExemptionItem } from '../../../../shared/interface/exemptions.model';
import { FormMode } from '../../../../shared/interface/form.model';
import { SpListItemAttachmentFiles } from '../../../../shared/interface/sp-list-item.model';
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-exemptions-form',
  styleUrls: ['exemptions-form.component.scss'],
  templateUrl: './exemptions-form.component.html',
  providers: [ExemptionsFormHttpService, ExemptionsFormInitService]
})
export class ExemptionsFormComponent implements OnInit, OnDestroy {
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

  // Form Mode is Subject
  $mode: Subject<FormMode>;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_exemptions: Store<fromExemptions.ExemptionsState>,
    private formInitService: ExemptionsFormInitService,
    public formRef: MatDialogRef<ExemptionsFormComponent>,
    // private formSizeService: PeopleFormSizeService,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: FormMode; item?: ExemptionItem }
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
  }

  createFormGroups(m: FormMode, it: ExemptionItem, lo: number) {
    // create 1 form group
    this.fg_fields = this.formInitService.create_FormGroup_Fields(m, it, lo);

    console.log('created 1 form group:');
    console.log(this.fg_fields);
  }

  switchFormMode(mode: FormMode) {
    this.$mode.next(mode);
  }

  // triggered after saving fields
  updateDataItem(updatedFields: ExemptionItem) {
    console.log('updating data item:');
    console.log(updatedFields);

    this.data.item = { ...this.data.item, ...updatedFields };
  }

  onSelectUser(selected: number[]) {
    // only one user allowed, so array should have 1 property
    this.fg_fields.get('SubmitterId').patchValue(selected[0]);
  }

  closeForm($event) {
    this.formRef.close($event);
  }

  // unsubscribe from Subscription when component is destroyed
  ngOnDestroy() {
    this.$window.unsubscribe();
    this.$locationAssignedId.unsubscribe();
  }
}
