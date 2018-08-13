import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

// rxjs
import { Observable, Subscription, combineLatest } from 'rxjs';
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';

// interfaces
import { FormMode } from '../../../interface/form.model';
import {
  PeopleItem,
  SearchParamsUser
} from './../../../interface/people.model';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete
} from '@angular/material';
import { SlbSpPath } from '../../../constants';

@Component({
  selector: 'app-fc-people-selector-single',
  styleUrls: ['fc-people-selector-single.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div fxFlex="45.5px" *ngIf="selected" class="selected-user">
        <img class="selected-user-photo" [src]="getUserPhoto(selected)">
    </div>
    <mat-form-field class="select-user-input" fxFlex [formGroup]="fg">
        <input type="text" matInput
          [placeholder]="displayName"
          formControlName="text"
          [matAutocomplete]="auto">

        <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn.bind(this)"
            (optionSelected)="userSelected($event)">
            <mat-option *ngFor="let user of users" [value]="user" class="user-option">
                {{ user.Shortname }}
            </mat-option>
        </mat-autocomplete>

        <app-fc-people-selector-single-fetch
            [fetch]="fetch" (onFetchSuccess)="onFetchSuccess($event)">
        </app-fc-people-selector-single-fetch>

    </mat-form-field>
    `
})
export class FcPeopleSelectorSingleComponent implements OnChanges {
  @Input()
  fg_fields: FormGroup;

  @Input()
  mode: FormMode;

  @Input()
  fieldName: string;

  @Input()
  displayName: string;

  @Input()
  selfUser?: PeopleItem; // used to add self in selected by default

  @Input()
  includeOnly: number[]; // specify empty [] if include all

  users: PeopleItem[];
  selected: PeopleItem;

  fg: FormGroup;

  // observables
  text$: Observable<string>;
  location$: Observable<number[]>;

  // subscriptions
  $query: Subscription;

  // fetch users object
  fetch: SearchParamsUser;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    // watch mode changes
    if (changes.mode) {
      this.onFormModeChange(changes.mode.currentValue);
    }
  }

  onFormModeChange(mode: FormMode) {
    console.log('people selector mode: ' + mode);
    // form in editing mode
    if (mode === 'new' || mode === 'edit') {
      this.activateEditingMode();

      if (mode === 'new' && this.selfUser) {
        this.applySelection(this.selfUser);
      }
    }
  }

  activateEditingMode() {
    this.createForm();
    this.startReactions();
  }

  createForm() {
    this.fg = this.fb.group({
      text: '',
      locations: '',
      top: 100
    });
  }

  startReactions() {
    this.location$ = this.fg_fields.controls['LocationId'].valueChanges.pipe(
      startWith(this.fg_fields.controls['LocationId'].value),
      map((location: number) => [location])
    );

    this.text$ = this.fg.controls['text'].valueChanges.pipe(
      startWith(''),
      filter(value => typeof value === 'string'),
      distinctUntilChanged(),
      debounceTime(400)
    );

    this.$query = combineLatest(this.text$, this.location$)
      .pipe(
        // compose query object as PeopleSearch should receive
        map((q: any[]) => {
          return { text: q[0], locations: q[1], top: 100 };
        }),
        // add positions if includeOnly has any
        map((q: SearchParamsUser) => {
          return this.includeOnly && this.includeOnly.length
            ? { ...q, positions: this.includeOnly }
            : q;
        })
      )
      .subscribe((query: SearchParamsUser) => {
        // update fetch object,
        // so that child logical component would react and fetch users
        console.log(query);
        this.fetch = { ...query };
      });
  }

  displayFn(user?: PeopleItem): string | undefined {
    console.log(user);
    console.log(this.selected);
    if (this.mode !== 'view' && !user && this.selected) {
      return this.selected.Shortname;
    } else {
      return user ? user.Shortname : undefined;
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
    this.fg_fields.controls[this.fieldName].patchValue(selected.Id);
  }

  getUserPhoto(selected: PeopleItem) {
    if (selected.Attachments) {
      return SlbSpPath + selected.AttachmentFiles.results[0].ServerRelativeUrl;
    }
  }
}
