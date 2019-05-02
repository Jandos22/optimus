import { Component, OnInit, OnDestroy, Inject } from "@angular/core";

import { FormGroup } from "@angular/forms";

// rxjs
import { Subscription, Observable, Subject } from "rxjs";

// ngrx
import { Store, select } from "@ngrx/store";
import * as fromRoot from "../../../../store";
import * as fromBatteries from "../../store";

// material
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

// form services
import { BatteriesFormInitService } from "./form-services/batteries-form-init.service";
import { BatteriesFormHttpService } from "./form-services/batteries-form-http.service";

// interfaces
import { BatteryItem } from "../../../../shared/interface/batteries.model";
import { FormMode } from "../../../../shared/interface/form.model";
import { SpListItemAttachmentFiles } from "../../../../shared/interface/sp-list-item.model";
import { LocationEnt } from "../../../../shared/interface/locations.model";
import { PeopleItem } from "../../../../shared/interface/people.model";

@Component({
  selector: "app-batteries-form",
  styleUrls: ["batteries-form.component.scss"],
  templateUrl: "./batteries-form.component.html",
  providers: [BatteriesFormHttpService, BatteriesFormInitService]
})
export class BatteriesFormComponent implements OnInit, OnDestroy {
  fg_fields: FormGroup;

  accessLevel$: Observable<number>;

  $locationAssignedId: Subscription;
  locationAssignedId: number;

  // form title
  Title: string;

  // get self optimus account
  selfUser$: Observable<PeopleItem>;

  // selectables
  locations$: Observable<LocationEnt[]>;

  // Form Mode is Subject
  $mode: Subject<FormMode>;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_batteries: Store<fromBatteries.BatteriesState>,
    private formInitService: BatteriesFormInitService,
    public formRef: MatDialogRef<BatteriesFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: FormMode; item?: BatteryItem }
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
      console.log("mode changed to: " + mode);
      this.data.mode = mode;
      console.log(this.data.item);

      this.createFormGroups(mode, this.data.item, this.locationAssignedId);
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

    // get user's location assigned id
    this.$locationAssignedId = this.store_root
      .pipe(select(fromRoot.getUserLocationAssignedId))
      .subscribe(locationId => (this.locationAssignedId = locationId));

    // get selectable locations
    this.locations$ = this.store_root.select(fromRoot.selectAllLocations);
  }

  createFormGroups(m: FormMode, it: BatteryItem, lo: number) {
    // create 1 form group
    this.fg_fields = this.formInitService.create_FormGroup_Fields(m, it, lo);
    console.log("created 1 form group:");
    console.log(this.fg_fields);
  }

  switchFormMode(mode: FormMode) {
    this.$mode.next(mode);
  }

  // triggered after saving fields
  updateDataItem(updatedFields: BatteryItem) {
    console.log("updating data item:");
    console.log(updatedFields);

    this.data.item = { ...this.data.item, ...updatedFields };
  }

  closeForm($event: any) {
    this.formRef.close($event);
  }

  // unsubscribe from Subscription when component is destroyed
  ngOnDestroy() {
    this.$locationAssignedId.unsubscribe();
  }
}
