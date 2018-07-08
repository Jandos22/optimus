import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

// rxjs
import { Observable, combineLatest, Subscription, Subject } from 'rxjs';
import { startWith, map, debounceTime, take, distinctUntilChanged, pairwise, filter, tap } from 'rxjs/operators';

// interfaces
import { LocationEnt } from '../../../../interface/locations.model';
import { PeopleItem, SearchParamsUser } from '../../../../interface/people.model';

// services
import { SearchUsersService, UtilitiesService } from '../../../../services';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material';

import * as _ from 'lodash';
import { element } from '../../../../../../../node_modules/protractor';

@Component({
  selector: 'app-fc-users-selection',
  styleUrls: ['fc-users-selection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field id="refWidth"
      fxFlex="65.5px" [formGroup]="fg_users">

      <input matInput
        #autoCompleteInput
        placeholder="Event Reporter(s)"
        [matAutocomplete]="auto"
        formControlName="text">

      <mat-autocomplete
        #auto="matAutocomplete" [displayWith]="displayFn"
        (optionSelected)="optionSelected($event)">

        <mat-option *ngFor="let user of users" [value]="user"
          (click)="keepOpen()" [disabled]="user.selected"
          [ngClass]="{ userSelected: user.selected }">
          <app-users-selection-user-option
            fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="8px"
            [user]="user">
          </app-users-selection-user-option>
        </mat-option>
      </mat-autocomplete>

      <div matSuffix *ngIf="!searching"
        class="prefix-as-chip">
        {{ getCountSelectedUsers() }}
      </div>

      <span matSuffix *ngIf="searching" style="margin-left: 8px;">
        <span class='fa_regular'><fa-icon [icon]="['fas', 'spinner']" [spin]="true"></fa-icon></span>
      </span>

    </mat-form-field>

    <app-users-selection-user-selected
      *ngFor="let user of this.fg_users.get('selectedUsers').value"
      fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="8px"
      class="common-form-user-item"
      [user]="user" (removeSelectedUser)="removeSelectedUser($event)">
    </app-users-selection-user-selected>
    `
})
export class FormControlUsersSelectionComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() accessLevel: number;

  @Output() onSelectUser = new EventEmitter<number[]>();

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger }) autoComplete: MatAutocompleteTrigger;
  @ViewChild('formField') el_FormField: ElementRef;

  // notifies subscribers each time screen size change
  // used to dynamically set maxWidth of fullname of selected users
  // necessary on small screens no trim users fullname
  $resizeEvent = new Subject;

  // form group for autocomplete input
  fg_users: FormGroup;

  $fc_selectedUsers: Subscription;

  users: PeopleItem[] = [];
  searching: boolean;

  // search query consists of
  text$: Observable<string>;
  locations$: Observable<number[]>;

  // combined observable
  $query: Subscription;

  constructor(
    private fb: FormBuilder,
    private srv: SearchUsersService,
  ) {}

  ngOnInit() {

    // initialize form group for searching users
    this.fg_users = this.fb.group({
      text: '',
      selectedUsers: ''
    });

    const initialLocations = this.fg_fields.get('LocationsId').value;

    // watch query text changes
    // pass only text and check if new value is different
    // also wait 500 ms until passing new value
    this.text$ = this.fg_users.get('text').valueChanges
      .pipe(
        startWith(''),
        filter(value => typeof value === 'string'),
        distinctUntilChanged(),
        debounceTime(500)
      );

    // watch selected locations changes
    this.locations$ = this.fg_fields.get('LocationsId').valueChanges
      .pipe(startWith(initialLocations));

    // react whenever watched input change
    this.$query = combineLatest(this.text$, this.locations$)
      .pipe(
        map(q => {
          return { text: q[0], locations: q[1] };
        })
      )
      .subscribe((query: SearchParamsUser) => {
        this.searchUsers(query);
      });

    // wait 100ms, no need to run flow on every pixel change
    // get width of parent container and pass it to calc maxWidth
    this.$resizeEvent.
      pipe(
        debounceTime(100),
        map(any => {
          return document.getElementById('refWidth').clientWidth;
        })
      ).
      subscribe(
        refWidth => this.setMaxWidth(refWidth)
    );

    // listen to selected users and when get user
    // then map to ids, then loop through users and disable selected
    // so that they cannot be selected again
    this.$fc_selectedUsers = this.fg_users.get('selectedUsers').valueChanges
      .pipe(
        map((selected: PeopleItem[]) => {
          return _.map(selected, function(user) {
            return user.ID;
          });
        }),
        tap(ids => this.disableSelected(ids))
      )
      .subscribe(ids => this.onSelectUser.emit(ids));
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

      return check ? { ...user, selected: true} : user;

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
    console.log(query);
    this.searching = true;
    const search$ = this.srv.searchUsers(query);

    search$.pipe(take(1)).subscribe(
      success => this.searchUsersSuccess(success),
      error => this.searchUsersError(error),
      () => console.log('search users completed')
    );
  }

  searchUsersSuccess(success) {
    console.log(success);
    this.searching = false;
    this.users = success;
    this.disableSelected(this.fg_fields.get('EventReportersId').value);
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
      const selected: null | PeopleItem[] = this.fg_users.get('selectedUsers').value;

      if (selected.length) {
        this.fg_users.get('selectedUsers').patchValue([ user, ...selected]);
      } else {
        this.fg_users.get('selectedUsers').patchValue([user]);
      }

      // neccessary if user already start with small screen size
      this.$resizeEvent.next();
    }

    keepOpen() {
      const self = this;
      setTimeout(function () {
        self.autoComplete.openPanel();
      }, 500);
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
    }

  getCountSelectedUsers() {
    const selected: PeopleItem[] = this.fg_users.get('selectedUsers').value;

    if (selected.length) {
      return `${selected.length}`;
    } else {
      return `0`;
    }
  }

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.$resizeEvent.next();
  }

  setMaxWidth(refWidth: number) {
    const selected: PeopleItem[] = this.fg_users.get('selectedUsers').value;

    // iterate every selected user
    // span.fullname has id ('user'+ ID)
    // calculate maxWidth, ref min rest elements widths (92)
    // set calculate maxWidth to the html element
    _.forEach(selected, function(user) {
      const maxWidth = `max-width: ${refWidth - 92}px;`;
      document.getElementById('user' + user.ID).setAttribute('style', maxWidth);
    });
  }

  ngOnDestroy() {
    this.$query.unsubscribe();
    this.$resizeEvent.unsubscribe();
    this.$fc_selectedUsers.unsubscribe();
  }

}
