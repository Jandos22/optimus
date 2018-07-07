import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

// rxjs
import { Observable, combineLatest, Subscription } from 'rxjs';
import { startWith, map, debounceTime, take } from 'rxjs/operators';

// interfaces
import { LocationEnt } from '../../../../../../shared/interface/locations.model';
import { PeopleItem, SearchParamsUser } from '../../../../../../shared/interface/people.model';

// services
import { SearchUsersService, UtilitiesService } from '../../../../../../shared/services';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-timeline-form-event-reporters',
  styleUrls: ['timeline-form-event-reporters.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="65.5px" [formGroup]="fg_users">

      <input matInput
        placeholder="Event Reporters"
        [matAutocomplete]="auto"
        formControlName="text">

      <mat-autocomplete
        #auto="matAutocomplete" [displayWith]="displayFn"
        (optionSelected)="optionSelected($event)">

        <mat-option *ngFor="let user of users" [value]="user">
          <div fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="16px">
            <div fxFlex="36px" class="selectable-user-photo-container">
              <img [src]="utils.userPhoto(user)">
            </div>
            <div fxFlex class="selectable__user--info" fxLayout="column" fxLayoutAlign="center start">
              <span class="fullname">{{ user.Fullname}}</span>
              <div class="second_line" fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="4px">
                <span>{{ user.LocationAssigned.Title }}</span>
                <span *ngIf="hasPosition(user)">&middot;</span>
                <span *ngIf="hasPosition(user)">{{ user.Position.Title}}</span>
              </div>
            </div>
          </div>
        </mat-option>
      </mat-autocomplete>

      <span matSuffix *ngIf="searching">
        <span class='fa_regular'><fa-icon [icon]="['fas', 'spinner']" [spin]="true"></fa-icon></span>
      </span>

    </mat-form-field>

    <div *ngFor="let user of selected_users"
      class="common-list-item">
      {{ user.Fullname }}
    </div>
    `
})
export class TimelineFormEventReportersComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() accessLevel: number;

  @Output() onPatchValues = new EventEmitter<any>();

  // form group for autocomplete input
  fg_users: FormGroup;

  users: PeopleItem[] = [];
  searching: boolean;
  selected_users: PeopleItem[] = [];

  // search query consists of
  text$: Observable<string>;
  locations$: Observable<number[]>;

  // combined observable
  $query: Subscription;

  constructor(
    private fb: FormBuilder,
    private srv: SearchUsersService,
    private utils: UtilitiesService
  ) {}

  ngOnInit() {

    // initialize form group for searching users
    this.fg_users = this.fb.group({
      text: ''
    });

    const initialLocations = this.fg_fields.get('LocationsId').value;

    // watch query text changes
    this.text$ = this.fg_users.get('text').valueChanges
      .pipe(startWith(''));

    // watch selected locations changes
    this.locations$ = this.fg_fields.get('LocationsId').valueChanges
      .pipe(startWith(initialLocations));

    // react whenever watched input change
    this.$query = combineLatest(this.text$, this.locations$)
      .pipe(
        map(q => {
          return { text: q[0], locations: q[1] };
        }),
        debounceTime(500)
      )
      .subscribe((query: SearchParamsUser) => {
        this.searchUsers(query);
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
  }

  searchUsersError(error) {
    this.searching = false;
    console.log(error);
  }

  displayFn(user?): string | undefined {
    return user ? 'selected' : '';
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    this.addToSelectedUsers(event.option.value);
    this.fg_users.get('text').setValue('');
  }

  addToSelectedUsers(user: PeopleItem) {
    this.selected_users = [ user, ...this.selected_users];
  }

  hasPosition(user) {
    return user.PositionId ? true : false;
  }

  ngOnDestroy() {
    this.$query.unsubscribe();
  }

}
