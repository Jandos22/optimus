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
import * as fromKaizen from '../../../../store';

// rxjs
import { Subscription, Observable, merge } from 'rxjs';
import { map, scan } from 'rxjs/operators';

// interfaces
import { KaizenProjectItem } from '../../../../../../shared/interface/kaizen.model';

@Component({
  selector: 'app-kaizen-form-actions-edit-fields',
  template: ``
})
export class KaizenFormActionsEditFieldsComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() initialFields: KaizenProjectItem;

  @Output() whenUnsavedFieldsChange = new EventEmitter<Object>();

  // combination of individual form control changes
  fc_changes$: Observable<Object>;

  // subscribe to result of scan and map operators
  $maybeUnsavedFields: Subscription;

  constructor(private store: Store<fromKaizen.KaizenState>) {}

  ngOnInit() {
    this.fc_changes$ = merge(
      // ProjectDate observable
      this.fg_fields
        .get('ProjectDate')
        .valueChanges.pipe(map(ProjectDate => ({ ProjectDate }))),
      // ProjectTypeId observable
      this.fg_fields
        .get('ProjectTypeId')
        .valueChanges.pipe(map(ProjectTypeId => ({ ProjectTypeId }))),
      // ImpactTypeId observable
      this.fg_fields
        .get('ImpactTypeId')
        .valueChanges.pipe(map(ImpactTypeId => ({ ImpactTypeId }))),
      // ValueCreationForClient observable
      this.fg_fields
        .get('ValueCreationForClient')
        .valueChanges.pipe(
          map(ValueCreationForClient => ({ ValueCreationForClient }))
        ),
      // Title observable
      this.fg_fields.get('Title').valueChanges.pipe(map(Title => ({ Title }))),
      // Summary observable
      this.fg_fields
        .get('Summary')
        .valueChanges.pipe(map(Summary => ({ Summary }))),
      // RichText observable
      this.fg_fields
        .get('RichText')
        .valueChanges.pipe(map(RichText => ({ RichText }))),
      // QuestRIR observable
      this.fg_fields
        .get('QuestRIR')
        .valueChanges.pipe(map(QuestRIR => ({ QuestRIR }))),
      // QuestQPID observable
      this.fg_fields
        .get('QuestQPID')
        .valueChanges.pipe(map(QuestQPID => ({ QuestQPID }))),
      // LocationId observable
      this.fg_fields
        .get('LocationsId')
        .valueChanges.pipe(map(LocationsId => ({ LocationsId }))),
      // DoneById observable
      this.fg_fields
        .get('DoneById')
        .valueChanges.pipe(map(DoneById => ({ DoneById })))
    );

    this.$maybeUnsavedFields = this.fc_changes$
      .pipe(
        scan((acc: KaizenProjectItem, curr) => {
          const key = Object.keys(curr).toString();
          if (this.initialFields[key] !== curr[key]) {
            return { ...acc, ...curr };
          } else if (this.initialFields[key] === curr[key]) {
            let rest;
            ({ [key]: key, ...rest } = acc);
            return rest;
          }
        }, {}),
        map((fields: KaizenProjectItem | {}) => {
          if (Object.keys(fields).length >= 1) {
            return { ...fields, id: this.initialFields['ID'] };
          } else {
            return fields;
          }
        })
      )
      .subscribe((fields: KaizenProjectItem | {}) => {
        // console.log(fields);
        this.whenUnsavedFieldsChange.emit(fields);
      });
  }

  ngOnDestroy() {
    this.$maybeUnsavedFields.unsubscribe();
  }
}
