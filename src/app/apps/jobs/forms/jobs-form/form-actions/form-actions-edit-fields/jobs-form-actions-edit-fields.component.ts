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
import * as fromJobs from '../../../../store';

// rxjs
import { Subscription, Observable, merge } from 'rxjs';
import { map, scan } from 'rxjs/operators';

// interfaces
import { JobItem } from '../../../../../../shared/interface/jobs.model';

@Component({
  selector: 'app-jobs-form-actions-edit-fields',
  template: ``
})
export class JobsFormActionsEditFieldsComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() initialFields: JobItem;

  @Output() whenUnsavedFieldsChange = new EventEmitter<Object>();

  // combination of individual form control changes
  fc_changes$: Observable<Object>;

  // subscribe to result of scan and map operators
  $maybeUnsavedFields: Subscription;

  constructor(private store: Store<fromJobs.JobsState>) {}

  ngOnInit() {
    this.fc_changes$ = merge(
      // Title observable
      this.fg_fields.get('Title').valueChanges.pipe(map(Title => ({ Title }))),

      // iDistrict observable
      this.fg_fields
        .get('iDistrict')
        .valueChanges.pipe(map(iDistrict => ({ iDistrict }))),

      // Well observable
      this.fg_fields.get('Well').valueChanges.pipe(map(Well => ({ Well }))),

      // FieldId observable
      this.fg_fields
        .get('FieldId')
        .valueChanges.pipe(map(FieldId => ({ FieldId }))),

      // RigUpStart observable
      this.fg_fields
        .get('RigUpStart')
        .valueChanges.pipe(map(RigUpStart => ({ RigUpStart }))),

      // RigUpEnd observable
      this.fg_fields
        .get('RigUpEnd')
        .valueChanges.pipe(map(RigUpEnd => ({ RigUpEnd }))),

      // RigUpEnd observable
      this.fg_fields
        .get('JobDuration')
        .valueChanges.pipe(map(JobDuration => ({ JobDuration }))),

      // SummarySections observable
      this.fg_fields
        .get('SummarySections')
        .valueChanges.pipe(map(SummarySections => ({ SummarySections }))),

      // JSStitle1 observable
      this.fg_fields
        .get('JSStitle1')
        .valueChanges.pipe(map(JSStitle1 => ({ JSStitle1 }))),
      // JSSbody1 observable
      this.fg_fields
        .get('JSSbody1')
        .valueChanges.pipe(map(JSSbody1 => ({ JSSbody1 }))),

      // JSStitle2 observable
      this.fg_fields
        .get('JSStitle2')
        .valueChanges.pipe(map(JSStitle2 => ({ JSStitle2 }))),
      // JSSbody2 observable
      this.fg_fields
        .get('JSSbody2')
        .valueChanges.pipe(map(JSSbody2 => ({ JSSbody2 }))),

      // LocationId observable
      this.fg_fields
        .get('LocationId')
        .valueChanges.pipe(map(LocationId => ({ LocationId })))
    );

    this.$maybeUnsavedFields = this.fc_changes$
      .pipe(
        scan((acc: JobItem, curr) => {
          const key = Object.keys(curr).toString();
          if (this.initialFields[key] !== curr[key]) {
            return { ...acc, ...curr };
          } else if (this.initialFields[key] === curr[key]) {
            let rest;
            ({ [key]: key, ...rest } = acc);
            return rest;
          }
        }, {}),
        map((fields: JobItem | {}) => {
          if (Object.keys(fields).length >= 1) {
            return { ...fields, id: this.initialFields['ID'] };
          } else {
            return fields;
          }
        })
      )
      .subscribe((fields: JobItem | {}) => {
        // console.log(fields);
        this.whenUnsavedFieldsChange.emit(fields);
      });
  }

  ngOnDestroy() {
    this.$maybeUnsavedFields.unsubscribe();
  }
}
