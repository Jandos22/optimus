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
import * as fromHarcs from '../../../../store';

// rxjs
import { Subscription, Observable, merge } from 'rxjs';
import { map, scan } from 'rxjs/operators';

// interfaces
import { HarcItem } from '../../../../../../shared/interface/harcs.model';

@Component({
  selector: 'app-harcs-form-actions-edit-fields',
  template: ``
})
export class HarcsFormActionsEditFieldsComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() initialFields: HarcItem;

  @Output() whenUnsavedFieldsChange = new EventEmitter<Object>();

  // combination of individual form control changes
  fc_changes$: Observable<Object>;

  // subscribe to result of scan and map operators
  $maybeUnsavedFields: Subscription;

  constructor(private store: Store<fromHarcs.HarcsState>) {}

  ngOnInit() {
    this.fc_changes$ = merge(
      // ExpiryDate observable
      this.fg_fields
        .get('ExpiryDate')
        .valueChanges.pipe(map(ExpiryDate => ({ ExpiryDate }))),

      // ExpiryDate observable
      this.fg_fields
        .get('Status')
        .valueChanges.pipe(map(Status => ({ Status }))),

      // ExpiryDate observable
      this.fg_fields
        .get('PendingActions')
        .valueChanges.pipe(map(PendingActions => ({ PendingActions }))),

      // Title observable
      this.fg_fields.get('Title').valueChanges.pipe(map(Title => ({ Title }))),

      // HashTags observable
      this.fg_fields
        .get('HashTags')
        .valueChanges.pipe(map(HashTags => ({ HashTags }))),

      // QuestNumber observable
      this.fg_fields
        .get('QuestNumber')
        .valueChanges.pipe(map(QuestNumber => ({ QuestNumber }))),

      // QuestQPID observable
      this.fg_fields
        .get('QuestQPID')
        .valueChanges.pipe(map(QuestQPID => ({ QuestQPID }))),

      // LocationId observable
      this.fg_fields
        .get('LocationId')
        .valueChanges.pipe(map(LocationId => ({ LocationId }))),

      // PICId observable
      this.fg_fields.get('PICId').valueChanges.pipe(map(PICId => ({ PICId })))
    );

    this.$maybeUnsavedFields = this.fc_changes$
      .pipe(
        scan((acc: HarcItem, curr) => {
          const key = Object.keys(curr).toString();
          if (this.initialFields[key] !== curr[key]) {
            return { ...acc, ...curr };
          } else if (this.initialFields[key] === curr[key]) {
            let rest;
            ({ [key]: key, ...rest } = acc);
            return rest;
          }
        }, {}),
        map((fields: HarcItem | {}) => {
          if (Object.keys(fields).length >= 1) {
            return { ...fields, id: this.initialFields['ID'] };
          } else {
            return fields;
          }
        })
      )
      .subscribe((fields: HarcItem | {}) => {
        // console.log(fields);
        this.whenUnsavedFieldsChange.emit(fields);
      });
  }

  ngOnDestroy() {
    this.$maybeUnsavedFields.unsubscribe();
  }
}
