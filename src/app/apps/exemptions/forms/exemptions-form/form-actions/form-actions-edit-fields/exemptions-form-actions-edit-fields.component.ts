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
import * as fromExemptions from '../../../../store';

// rxjs
import { Subscription, Observable, merge } from 'rxjs';
import { map, scan } from 'rxjs/operators';

// interfaces
import { ExemptionItem } from '../../../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-form-actions-edit-fields',
  template: ``
})
export class ExemptionsFormActionsEditFieldsComponent
  implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() initialFields: ExemptionItem;

  @Output() whenUnsavedFieldsChange = new EventEmitter<Object>();

  // combination of individual form control changes
  fc_changes$: Observable<Object>;

  // subscribe to result of scan and map operators
  $maybeUnsavedFields: Subscription;

  constructor(private store: Store<fromExemptions.ExemptionsState>) {}

  ngOnInit() {
    this.fc_changes$ = merge(
      // ExpiryDate observable
      this.fg_fields
        .get('ExpiryDate')
        .valueChanges.pipe(map(ExpiryDate => ({ ExpiryDate }))),

      // Title observable
      this.fg_fields.get('Title').valueChanges.pipe(map(Title => ({ Title }))),

      // Summary observable
      this.fg_fields
        .get('Summary')
        .valueChanges.pipe(map(Summary => ({ Summary }))),

      // HashTags observable
      this.fg_fields
        .get('HashTags')
        .valueChanges.pipe(map(HashTags => ({ HashTags }))),

      // QuestRIR observable
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

      // SubmitterId observable
      this.fg_fields
        .get('SubmitterId')
        .valueChanges.pipe(map(SubmitterId => ({ SubmitterId })))
    );

    this.$maybeUnsavedFields = this.fc_changes$
      .pipe(
        scan((acc: ExemptionItem, curr) => {
          const key = Object.keys(curr).toString();
          if (this.initialFields[key] !== curr[key]) {
            return { ...acc, ...curr };
          } else if (this.initialFields[key] === curr[key]) {
            let rest;
            ({ [key]: key, ...rest } = acc);
            return rest;
          }
        }, {}),
        map((fields: ExemptionItem | {}) => {
          if (Object.keys(fields).length >= 1) {
            return { ...fields, id: this.initialFields['ID'] };
          } else {
            return fields;
          }
        })
      )
      .subscribe((fields: ExemptionItem | {}) => {
        // console.log(fields);
        this.whenUnsavedFieldsChange.emit(fields);
      });
  }

  ngOnDestroy() {
    this.$maybeUnsavedFields.unsubscribe();
  }
}
