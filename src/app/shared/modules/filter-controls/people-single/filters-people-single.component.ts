import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { FormGroup, FormBuilder } from '@angular/forms';

// material
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete
} from '@angular/material';

// rxjs
import { Observable, Subscription, combineLatest, of } from 'rxjs';
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
  filter,
  tap
} from 'rxjs/operators';

// interfaces
import { FormMode } from '../../../interface/form.model';
import {
  PeopleItem,
  SearchParamsUser
} from './../../../interface/people.model';

// constants
import { SlbSpPath } from '../../../constants';

@Component({
  selector: 'app-filters-people-single',
  styleUrls: ['filters-people-single.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div fxFlex="45.5px" *ngIf="selected" class="selected-user">
      <img class="selected-user-photo" [src]="getUserPhoto(selected)" />
    </div>
    <mat-form-field class="select-user-input" fxFlex [formGroup]="fg">
      <input
        type="text"
        matInput
        [placeholder]="displayName"
        formControlName="text"
        [matAutocomplete]="auto"
      />

      <button
        mat-icon-button
        matTooltip="unselect"
        matSuffix
        *ngIf="selected && !disabled"
        (click)="preselectDefault(default)"
      >
        <span class="fa_regular"
          ><fa-icon [icon]="['fas', 'times']"></fa-icon
        ></span>
      </button>

      <mat-autocomplete
        #auto="matAutocomplete"
        [displayWith]="displayFn.bind(this)"
        (optionSelected)="userSelected($event)"
      >
        <mat-option
          *ngFor="let user of users"
          [value]="user"
          class="user-option"
        >
          <div
            class="user-option-container"
            fxLayout="row nowrap"
            fxLayoutAlign="space-between center"
          >
            <div fxFlex="36px" class="photo-container">
              <img class="user-photo" [src]="getUserPhoto(user)" />
            </div>
            <div class="fullname">{{ user.Fullname }}</div>
          </div>
        </mat-option>
      </mat-autocomplete>

      <app-filters-people-single-fetch
        [fetch]="fetch"
        (onFetchSuccess)="onFetchSuccess($event)"
      >
      </app-filters-people-single-fetch>
    </mat-form-field>
  `
})
export class FiltersPeopleSingleComponent implements OnInit, OnChanges {
  @Input()
  fg_filters: FormGroup;

  @Input()
  displayName: string;

  @Input()
  selfUser?: PeopleItem; // used to add self in selected by default

  @Input()
  default: PeopleItem | null;

  @Input()
  disabled: boolean;

  @Input()
  reset: boolean;

  @Input()
  resetThis: boolean;

  @Input()
  includeOnly: number[]; // specify empty [] if include all

  @Input()
  locationGlobal: boolean;

  @Output()
  onSelectUser = new EventEmitter<number>();

  users: PeopleItem[];
  selected: PeopleItem;

  fg: FormGroup;

  // observables
  text$: Observable<string>;
  location$: Observable<number[] | 'Global' | string>;
  chooseFrom$: Observable<null | number[]>;

  // subscriptions
  $query: Subscription;

  // fetch users object
  fetch: SearchParamsUser;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.createForm();
    this.startReactions();
    this.preselectDefault(this.default);
    this.checkDisabled(this.disabled);
  }

  createForm() {
    this.fg = this.fb.group({
      text: '',
      locations: '',
      top: 100,
      chooseFrom: ''
    });
    console.log(this.fg.value);
  }

  startReactions() {
    // listen to changes in fg_filters > locations
    // then pass value to $query

    if (this.locationGlobal === false) {
      this.location$ = this.fg_filters.controls['locations'].valueChanges.pipe(
        startWith(this.fg_filters.controls['locations'].value),
        map((locations: number[]) => [...locations])
      );
    } else {
      this.location$ = of('Global');
    }

    // listen to changes in text input
    // then pass value to $query
    this.text$ = this.fg.controls['text'].valueChanges.pipe(
      startWith(''),
      filter(value => typeof value === 'string'),
      distinctUntilChanged(),
      debounceTime(400)
      // tap(() => {
      //   this.cd.detectChanges();
      // })
    );

    this.chooseFrom$ = this.fg_filters.controls['chooseFrom'].valueChanges.pipe(
      startWith(null),
      distinctUntilChanged(),
      debounceTime(400)
    );

    this.$query = combineLatest(this.text$, this.location$, this.chooseFrom$)
      .pipe(
        // compose query object as PeopleSearch should receive
        map((q: any[]) => {
          return { text: q[0], locations: q[1], chooseFrom: q[2], top: 100 };
        }),
        // add position ids if includeOnly has any
        map((q: SearchParamsUser) => {
          return this.includeOnly && this.includeOnly.length
            ? { ...q, positions: this.includeOnly }
            : q;
        })
      )
      .subscribe((query: SearchParamsUser) => {
        // update fetch object,
        // so that child logical component would react and fetch users
        this.fetch = { ...query };
        this.cd.detectChanges();
      });
  }

  displayFn(user?: PeopleItem): string | undefined {
    console.log(user);
    console.log(this.selected);
    if (!user && this.selected) {
      return this.selected.Fullname;
    } else {
      return user ? user.Fullname : undefined;
    }
  }

  // from child
  onFetchSuccess(users: PeopleItem[]) {
    console.log(users);
    this.users = [...users];
  }

  userSelected(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value);
    this.applySelection(event.option.value);
  }

  applySelection(selected: PeopleItem) {
    this.selected = selected;
    this.onSelectUser.emit(selected.Id);
  }

  preselectDefault(preselected: PeopleItem) {
    if (preselected) {
      this.selected = preselected;
      this.onSelectUser.emit(preselected.Id);
    } else {
      this.selected = null;
      this.onSelectUser.emit();
      this.fg.controls['text'].patchValue('');
      // this.cd.detectChanges();
    }
  }

  checkDisabled(disabled: boolean) {
    console.log('disabled: ' + disabled);
    if (this.fg) {
      if (disabled) {
        this.fg.controls['text'].disable();
      } else {
        this.fg.controls['text'].enable();
      }
    }
  }

  getUserPhoto(selected: PeopleItem) {
    if (selected.Attachments) {
      return SlbSpPath + selected.AttachmentFiles.results[0].ServerRelativeUrl;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // reset can toggle between true or false
    // each time reset value changes
    // run reset workflow
    if (changes.reset && changes.reset.currentValue) {
      if (changes.reset.currentValue !== changes.reset.previousValue) {
        this.preselectDefault(this.default);
      }
    }

    // reset can toggle between true or false
    // each time reset value changes
    // run reset workflow
    if (changes.resetGivenFor && changes.resetGivenFor.currentValue) {
      console.log(changes.resetGivenFor.currentValue);
      if (
        changes.resetGivenFor.currentValue !==
        changes.resetGivenFor.previousValue
      ) {
        this.preselectDefault(this.default);
      }
    }

    if (changes.disabled) {
      if (changes.disabled.currentValue !== changes.disabled.previousValue) {
        this.checkDisabled(changes.disabled.currentValue);
      }
    }
  }
}
