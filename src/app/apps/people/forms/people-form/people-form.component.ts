import { Component, OnInit, OnDestroy, Inject } from "@angular/core";

// constants
import {
  PathSlbSp,
  WirelinePath,
  PathOptimus
} from "../../../../shared/constants";

import { FormGroup } from "@angular/forms";

// rxjs
import { Subscription, Observable, Subject } from "rxjs";

import {
  map,
  tap,
  switchMap,
  take,
  filter,
  pluck,
  takeUntil
} from "rxjs/operators";

import * as _ from "lodash";

// ngrx
import { Store, select } from "@ngrx/store";
import * as fromRoot from "../../../../store";
import * as fromPeople from "../../store";

// material
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

// form services
import { PeopleFormInitService } from "./form-services/people-form-init.service";
// import { PeopleFormValueService } from './form-services/people-form-value.service';
// import { PeopleFormSizeService } from './form-services/people-form-size.service';
import { PeopleFormPhotoService } from "./form-services/people-form-photo.service";
import { PeopleFormHttpService } from "./form-services/people-form-http.service";

// interfaces
import {
  PeopleItem,
  UserPosition
} from "../../../../shared/interface/people.model";
import { FormMode } from "../../../../shared/interface/form.model";

// dialog components
import {
  PeopleFormPhotoPickerComponent,
  UserPhotoState
} from "../people-form-photo-picker/people-form-photo-picker.component";
import { SpListItemAttachmentFiles } from "../../../../shared/interface/sp-list-item.model";

// people groups
import { people_op } from "../../../../shared/constants/ids-op";
import { groupPsdmJdl } from "../../../../shared/constants/people-groups.const";

@Component({
  selector: "app-people-form",
  styleUrls: ["people-form.component.scss"],
  templateUrl: "./people-form.component.html",
  providers: [
    PeopleFormInitService,
    // PeopleFormValueService,
    // PeopleFormSizeService,
    PeopleFormPhotoService,
    PeopleFormHttpService
  ]
})
export class PeopleFormComponent implements OnInit, OnDestroy {
  // form shall have only two form groups
  // which are initialized immediately in class constructor
  fg_fields: FormGroup;
  fg_photo: FormGroup;

  // form title
  Title: string;

  // subscribe to window from root store
  // used to update form size dynamically
  // $window: Subscription;

  // select locations list from store to for selection input
  $locations: Observable<any>;
  peoplePositions$: Observable<UserPosition[]>;

  // user access level
  ual$: Observable<number>;

  // current user
  currentUser$: Observable<PeopleItem>;
  $currentUser: Subscription;
  currentUser: PeopleItem;

  // Form Mode is Subject
  $mode: Subject<FormMode>;

  // react to value changes in form
  alias$: Subscription;

  // people groups
  operators = people_op;

  constructor(
    private _root_store: Store<fromRoot.RootState>,
    private initFormService: PeopleFormInitService,
    public formRef: MatDialogRef<PeopleFormComponent>,
    // private formSizeService: PeopleFormSizeService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: FormMode; item?: PeopleItem }
  ) {}

  ngOnInit() {
    this.$mode = new Subject<FormMode>();

    // when Form Mode changes initialize form groups
    this.$mode.subscribe(mode => {
      console.log("mode changed to: " + mode);
      console.log(this.data.item);
      this.data.mode = mode;
      this.initialize_FormGroup_Fields(mode, this.data.item);
      this.initialize_FormGroup_Photo(mode, this.data.item);
      this.updateFormTitle(mode);
    });

    // CHANGE FORM MODE during ngOnInit()
    this.$mode.next(this.data.mode);

    // SELECTABLE OBSERVABLES
    this.$locations = this._root_store.select(fromRoot.selectAllLocations);
    this.peoplePositions$ = this._root_store.pipe(
      select(fromPeople.selectAllPeoplePositions)
    );

    // USER ACCESS LEVEL
    this.ual$ = this._root_store.pipe(select(fromRoot.getUserAccessLevel));

    // CURRENT USER data
    this.currentUser$ = this._root_store.pipe(select(fromRoot.getUserOptimus));

    // when alias changed, also update email
    this.alias$ = this.fg_fields
      .get("Alias")
      .valueChanges.subscribe((alias: string) => {
        this.fg_fields.get("Email").setValue(`${alias}@slb.com`);
        this.updatePhotoFilename();
      });

    this.startSubscriptions();
  }

  startSubscriptions() {
    this.$currentUser = this.currentUser$.subscribe(
      (currentUser: PeopleItem) => (this.currentUser = currentUser)
    );
  }

  // *** form group for fields
  initialize_FormGroup_Fields(mode, item?) {
    this.fg_fields = this.initFormService.create_FormGroup_Fields(mode, item);
    console.log(this.fg_fields);
  }

  // *** form group for photo
  initialize_FormGroup_Photo(mode, item?) {
    console.log(mode);
    this.fg_photo = this.initFormService.create_FormGroup_Photo(mode, item);
    console.log(this.fg_photo);
  }

  // Utility Functions

  updatePhotoFilename(): void {
    const alias: string = this.fg_fields.get("Alias").value;
    this.fg_photo.get("Filename").setValue(alias ? `${alias}.jpg` : "");
  }

  updateFormTitle(mode) {
    const name = this.fg_fields.get("Name").value;
    const surname = this.fg_fields.get("Surname").value;
    if (mode === "new") {
      this.Title = "New User";
    } else {
      this.Title = name + " " + surname;
    }
  }

  switchFormMode(mode: FormMode) {
    this.$mode.next(mode);
  }

  updateFormGroupFields(updatedFields: PeopleItem) {
    console.log(updatedFields);
    this.data.item = { ...this.data.item, ...updatedFields };
  }

  updateFormGroupPhoto(newPhoto: SpListItemAttachmentFiles[]) {
    console.log(this.data.item);
    console.log(newPhoto);
    this.data.item = {
      ...this.data.item,
      Attachments: true,
      AttachmentFiles: {
        results: { ...newPhoto }
      }
    };
  }

  // triggered from PeopleFormPhoto component
  photoChanged(newPhoto: { PhotoUrl: string; ArrayBuffer: ArrayBuffer }) {
    this.fg_photo.get("PhotoUrl").patchValue(newPhoto.PhotoUrl);
    this.fg_photo.get("ArrayBuffer").patchValue(newPhoto.ArrayBuffer);
    // this.unsavedPhoto = { hasUnsavedPhoto: true, ...newPhoto };
  }

  closeUserForm($event) {
    this.formRef.close($event);
  }

  onSelectDirectReport(selected: number[]) {
    this.fg_fields
      .get("DirectReportsId")
      .get("results")
      .patchValue(selected);
  }

  // Only PSDM or JDL can edit Direct Reports
  // All can view Direct Reports
  get isPSDM() {
    if (this.currentUser) {
      return _.find(groupPsdmJdl, id => id === this.currentUser.PositionId)
        ? true
        : false;
    } else {
      return false;
    }
  }

  // unsubscribe from Subscription when component is destroyed
  ngOnDestroy() {
    this.$mode.unsubscribe();
    // this.$window.unsubscribe();
    this.alias$.unsubscribe();
    this.$currentUser.unsubscribe();
  }
}
