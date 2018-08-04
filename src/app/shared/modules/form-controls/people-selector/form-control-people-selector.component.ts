import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  ElementRef,
  SimpleChange
} from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

// material
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material';

// rxjs
import { Observable, combineLatest, Subscription, Subject, from } from 'rxjs';
import {
  startWith,
  map,
  concatMap,
  reduce,
  debounceTime,
  take,
  distinctUntilChanged,
  pairwise,
  filter,
  tap
} from 'rxjs/operators';

import * as _ from 'lodash';

// interfaces
import { LocationEnt } from '../../../interface/locations.model';
import { PeopleItem, SearchParamsUser } from '../../../interface/people.model';
import { FormMode } from '../../../interface/form.model';

// services
import { SearchUsersService, UtilitiesService } from '../../../services';
import { PeopleLookupService } from './../../../services/people-lookup.service';

@Component({
  selector: 'app-form-control-people-selector',
  styleUrls: ['form-control-people-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [id]="'refWidth' + id" *ngIf="mode !== 'view'"
      class="people-selector-field" [formGroup]="fg_users"
      [ngClass]="{ 'forFilters': forFilters }">

      <input matInput
        #autoCompleteInput
        [placeholder]="displayName"
        [matAutocomplete]="auto"
        formControlName="text"
        [disabled]="mode === 'view'">

      <mat-autocomplete
        #auto="matAutocomplete" [displayWith]="displayFn"
        (optionSelected)="optionSelected($event)">

        <mat-option *ngFor="let user of users" [value]="user"
          (click)="keepOpen()" [disabled]="user.selected"
          [ngClass]="{ 'people-selector-selected': user.selected }">

          <app-people-selector-option fxLayout="row nowrap" fxLayoutAlign="start center"
            [user]="user">
          </app-people-selector-option>

        </mat-option>
      </mat-autocomplete>

      <div matSuffix *ngIf="!searching"
        class="people-selector-suffix-chip">
        {{ getCountSelectedUsers() }}
      </div>

      <span matSuffix *ngIf="searching" style="margin-left: 8px;">
        <span class='fa_regular'><fa-icon [icon]="['fas', 'spinner']" [spin]="true"></fa-icon></span>
      </span>

    </mat-form-field>

    <!-- button to select self -->
    <div class='filter-button-select-self' *ngIf="forFilters"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="tooltipSelectMe" (click)="addSelfToSelected(selfUser)">
      <fa-icon [icon]="['fas', 'user']"></fa-icon>
    </div>

    <app-people-selector-selected
      *ngFor="let user of this.fg_users.get('selectedUsers').value"
      fxLayout="row nowrap" fxLayoutAlign="start center"
      class="people-selector-selected-item"
      [user]="user" [mode]="mode"
      (removeSelectedUser)="removeSelectedUser($event)">
    </app-people-selector-selected>
    `
})
export class FormControlPeopleSelectorComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() placeholder: string;
  @Input() fieldName: string; // form control name
  @Input() displayName: string; // label name
  @Input() fg_fields: FormGroup;
  @Input() selfUser?: PeopleItem; // used to add self in selected by default
  @Input() allowNumberOfUsers: number;
  @Input() mode: FormMode;
  @Input() singleLocation: boolean; // Location or Locations
  @Input() includeOnly: number[]; // array with People Positions, like ['FE','GFE']

  // used in apps filters only
  @Input() forFilters: boolean; // Location or Locations
  @Input() doReset: boolean;
  selfSelected: boolean;
  tooltipSelectMe = 'Select Me';

  @Output() onSelectUser = new EventEmitter<number[]>();

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;
  @ViewChild('formField') el_FormField: ElementRef;

  // form group for autocomplete input
  fg_users: FormGroup;

  $fc_selectedUsers: Subscription;

  users: PeopleItem[] = [];
  searching: boolean;
  limitReached: boolean;

  // search query consists of
  text$: Observable<string>;
  locations$: Observable<number[]>;
  top$: Observable<number>;

  // combined observable
  $query: Subscription;

  constructor(
    private fb: FormBuilder,
    private srv: SearchUsersService,
    private lookup: PeopleLookupService
  ) {}

  ngOnInit() {
    this.initFormGroup(this.mode);

    console.log(this.fg_users);

    // watch location/locations changes
    // start with inital value from fg_fields
    // log in console whenever location selection changed
    if (!this.singleLocation && !this.forFilters) {
      this.locations$ = this.fg_fields.controls[
        'LocationsId'
      ].valueChanges.pipe(
        startWith(this.fg_fields.get('LocationsId').get('results').value),
        tap(v => console.log(v))
      );
    } else if (this.singleLocation && !this.forFilters) {
      this.locations$ = this.fg_fields.controls['LocationId'].valueChanges.pipe(
        startWith(this.fg_fields.get('LocationId').value),
        map((location: number) => [location]),
        tap(v => console.log(v))
      );
    } else if (this.forFilters) {
      this.locations$ = this.fg_fields.controls['locations'].valueChanges.pipe(
        startWith(this.fg_fields.get('locations').value),
        map((locations: number[]) => [...locations]),
        tap(v => console.log(v))
      );
    }

    // watch query text changes
    // pass only text and check if new value is different
    // also wait 500 ms until passing new value
    this.text$ = this.fg_users.get('text').valueChanges.pipe(
      startWith(''),
      filter(value => typeof value === 'string'),
      distinctUntilChanged(),
      debounceTime(500)
    );

    // watch query text changes
    // pass only text and check if new value is different
    // also wait 500 ms until passing new value
    this.top$ = this.fg_users.get('top').valueChanges.pipe(
      startWith(100),
      distinctUntilChanged()
    );

    // react whenever watched input change
    this.$query = combineLatest(this.text$, this.locations$, this.top$)
      .pipe(
        map((q: SearchParamsUser) => {
          // compose params
          // console.log(this.includeOnly);
          return { text: q[0], locations: q[1], top: q[2] };
        }),
        map(
          (q: SearchParamsUser) =>
            this.includeOnly.length ? { ...q, positions: this.includeOnly } : q
        )
      )
      .subscribe((query: SearchParamsUser) => {
        this.searchUsers(query);
      });

    // listen to selected users and when get user
    // then map to ids, then loop through users and disable selected
    // so that they cannot be selected again
    this.$fc_selectedUsers = this.fg_users
      .get('selectedUsers')
      .valueChanges.pipe(
        map((selected: PeopleItem[]) => {
          return _.map(selected, function(user) {
            return user.ID;
          });
        }),
        tap(ids => this.disableSelected(ids))
      )
      .subscribe(ids => this.onSelectUser.emit(ids));

    // when opening new form
    // then add user to selected automatically
    if (this.mode === 'new' && !this.forFilters) {
      this.addSelfToSelected(this.selfUser);
    }

    // when opening form in view mode
    // then get IDs array and fetch users' info
    if (this.mode === 'view') {
      // prepare input to handle reporters depending on number of users
      if (this.allowNumberOfUsers === 1) {
        const id: number = this.fg_fields.controls[this.fieldName].value;
        this.handleReporters({ results: [id] });
      } else {
        this.handleReporters(this.fg_fields.controls[this.fieldName].value);
      }
    }
  }

  initFormGroup(mode: FormMode) {
    console.log(mode);
    // initialize form group for searching users
    this.fg_users = this.fb.group({
      text: '',
      selectedUsers: '',
      top: ''
    });
  }

  addSelfToSelected(self: PeopleItem) {
    if (self && !this.selfSelected) {
      this.selfSelected = true;
      this.addSelectedUsers(self);
      this.tooltipSelectMe = 'Unselect Me';
    } else if (self && this.selfSelected) {
      this.removeSelectedUser(self.Id);
      this.selfSelected = false;
      this.tooltipSelectMe = 'Select Me';
    }
  }

  // receive ids array
  // then iterate each and when user's id is found in ids
  // append selected property and set it to true
  // otherwise return user untouched
  disableSelected(ids: number[]) {
    this.users = _.map(this.users, function(user) {
      const check = _.find(ids, function(id) {
        return id === user.ID;
      });

      return check ? { ...user, selected: true } : { ...user, selected: false };
    });
  }

  // disable all users (mark as selected),
  // if selected.length is equal to allowNumberOfUsers
  disableAll() {
    this.users = _.map(this.users, function(user) {
      return { ...user, selected: true };
    });
  }

  // when user is removed from selected,
  // then iterate users and find
  enableUnselected(id: number) {
    this.users = _.map(this.users, function(user) {
      return user.ID === id ? { ...user, selected: false } : user;
    });

    const self = this;

    _.find(this.users, function(user, i) {
      if (user.ID === id) {
        self.users[i] = { ...user, selected: false };
      }
      return user.ID === id;
    });
  }

  searchUsers(query: SearchParamsUser) {
    console.log('search users started');
    // console.log(query);
    this.searching = true;
    const search$ = this.srv.searchUsers(query);

    search$
      .pipe(take(1))
      .subscribe(
        success => this.searchUsersSuccess(success),
        error => this.searchUsersError(error),
        () => console.log('search users completed')
      );
  }

  searchUsersSuccess(success) {
    console.log(success);
    this.searching = false;
    this.users = success;

    if (this.allowNumberOfUsers === 1) {
      this.disableSelected(this.fg_fields.get(this.fieldName).value);
    } else {
      this.disableSelected(
        this.fg_fields.get(this.fieldName).get('results').value
      );
    }

    this.checkSelectionLimit();
  }

  searchUsersError(error) {
    console.log(error);
    this.searching = false;
  }

  displayFn(user?): string | undefined {
    return ''; // in any case let it be empty string
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    this.addSelectedUsers(event.option.value);
    this.keepOpen();
    this.resetText();
  }

  addSelectedUsers(user: PeopleItem) {
    console.log('adding user to selected: ' + user.Alias);
    console.log('limit is:' + this.allowNumberOfUsers);

    // previously selected users
    const selected: null | PeopleItem[] = this.fg_users.get('selectedUsers')
      .value;

    console.log('previously selected number of users: ' + selected.length);

    if (selected.length && selected.length < this.allowNumberOfUsers) {
      this.fg_users.get('selectedUsers').patchValue([user, ...selected]);
    } else if (selected.length === 0) {
      this.fg_users.get('selectedUsers').patchValue([user]);
    }

    const newSelected: null | PeopleItem[] = this.fg_users.get('selectedUsers')
      .value;

    this.checkSelectionLimit();
  }

  checkSelectionLimit() {
    const newSelected: null | PeopleItem[] = this.fg_users.get('selectedUsers')
      .value;

    if (newSelected.length === this.allowNumberOfUsers) {
      console.log('limit reached, disable all options');
      this.limitReached = true;
      this.disableAll();
    } else {
      this.limitReached = false;
    }
  }

  keepOpen() {
    const self = this;
    // don't reopen if user selected and limit reached
    if (!this.limitReached) {
      setTimeout(function() {
        self.autoComplete.openPanel();
      }, 100);
    }
  }

  resetText() {
    this.fg_users.get('text').setValue('');
  }

  // @output from child
  removeSelectedUser(id: number) {
    console.log('remove user with id:' + id);
    // get selected users
    const selected: PeopleItem[] = this.fg_users.get('selectedUsers').value;
    // get new array without removed user
    const filtered = _.filter(selected, function(o: PeopleItem) {
      return o.ID !== id;
    });
    // unselect user in users
    this.enableUnselected(id);
    // overwrite previously selected users
    this.fg_users.get('selectedUsers').patchValue(filtered);

    if (id === this.selfUser.Id) {
      this.selfSelected = false;
      this.tooltipSelectMe = 'Select Me';
    }
  }

  getCountSelectedUsers() {
    const selected: PeopleItem[] = this.fg_users.get('selectedUsers').value;

    if (selected.length) {
      return `${selected.length}`;
    } else {
      return `0`;
    }
  }

  handleReporters(reporters: { results?: number[] }) {
    console.log(reporters);

    const ids: number[] = reporters.results;

    if (ids.length) {
      const reps$: Observable<number> = from(ids);

      reps$
        .pipe(
          take(Number(ids.length)),
          concatMap(id => {
            return this.lookup.getUserById(id);
          }),
          reduce((acc: PeopleItem[], curr: PeopleItem) => {
            return [...acc, curr[0]];
          }, [])
        )
        .subscribe(v => {
          console.log(v);
          this.fg_users.controls['selectedUsers'].patchValue(v);
        });
    }
  }

  ngOnDestroy() {
    this.$query.unsubscribe();
    this.$fc_selectedUsers.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.doReset) {
      if (changes.doReset.currentValue) {
        console.log('reset');
        if (changes.doReset.currentValue !== changes.doReset.previousValue) {
          this.fg_users.get('selectedUsers').patchValue([]);
        }
      }
    }
  }
}
