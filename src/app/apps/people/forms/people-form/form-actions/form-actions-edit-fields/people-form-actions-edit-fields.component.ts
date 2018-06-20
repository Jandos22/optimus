import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// ngrx
import { Store } from '@ngrx/store';
import * as fromPeople from '../../../../store';

// rxjs
import { Subscription, Observable, merge } from 'rxjs';
import { map, filter, debounceTime, scan } from 'rxjs/operators';

// interfaces
import { PeopleItem } from './../../../../../../shared/interface/people.model';

@Component({
  selector: 'app-people-form-actions-edit-fields',
  template: ``
})
export class PeopleFormActionsEditFieldsComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() initialFields: PeopleItem;

  @Output() whenUnsavedFieldsChange = new EventEmitter<Object>();

  // combination of individual form control changes
  fc_changes$: Observable<Object>;

  // subscribe to result of scan and map operators
  $maybeUnsavedFields: Subscription;

  constructor(private store: Store<fromPeople.PeopleState>) {
    console.log('people-form-actions-edit-fields component: initialized');
  }

  ngOnInit() {
    this.fc_changes$ = merge(
      this.fg_fields.get('Name').valueChanges.pipe(map(Name => ({ Name }))),
      this.fg_fields
        .get('Surname')
        .valueChanges.pipe(map(Surname => ({ Surname }))),
      this.fg_fields.get('Alias').valueChanges.pipe(map(Alias => ({ Alias }))),
      this.fg_fields.get('Email').valueChanges.pipe(map(Email => ({ Email }))),
      this.fg_fields.get('Gin').valueChanges.pipe(map(Gin => ({ Gin }))),
      this.fg_fields
        .get('LocationAssignedId')
        .valueChanges.pipe(map(id => ({ LocationAssignedId: id })))
    );

    this.$maybeUnsavedFields = this.fc_changes$
      .pipe(
        scan((acc: PeopleItem, curr) => {
          const key = Object.keys(curr).toString();
          if (this.initialFields[key] !== curr[key]) {
            return { ...acc, ...curr };
          } else if (this.initialFields[key] === curr[key]) {
            let rest;
            ({ [key]: key, ...rest } = acc);
            return rest;
          }
        }, {}),
        map((fields: PeopleItem | {}) => {
          if (Object.keys(fields).length >= 1) {
            return { ...fields, id: this.initialFields['ID'] };
          } else {
            return fields;
          }
        })
      )
      .subscribe((fields: PeopleItem | {}) => {
        // console.log(fields);
        this.whenUnsavedFieldsChange.emit(fields);
      });
  }

  ngOnDestroy() {
    console.log('people-form-actions-edit-fields component: "destroyed"');
    this.$maybeUnsavedFields.unsubscribe();
  }
}