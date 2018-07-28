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

      // iDistrict observable
      this.fg_fields
        .get('JobType')
        .valueChanges.pipe(map(JobType => ({ JobType }))),

      // TotalDepth observable
      this.fg_fields
        .get('TotalDepth')
        .valueChanges.pipe(map(TotalDepth => ({ TotalDepth }))),

      // MaxDeviation observable
      this.fg_fields
        .get('MaxDeviation')
        .valueChanges.pipe(map(MaxDeviation => ({ MaxDeviation }))),

      // TotalDepthUnits observable
      this.fg_fields
        .get('TotalDepthUnits')
        .valueChanges.pipe(map(TotalDepthUnits => ({ TotalDepthUnits }))),

      // Well observable
      this.fg_fields.get('Well').valueChanges.pipe(map(Well => ({ Well }))),

      // FieldId observable
      this.fg_fields
        .get('FieldId')
        .valueChanges.pipe(map(FieldId => ({ FieldId }))),

      // ClientId observable
      this.fg_fields
        .get('ClientId')
        .valueChanges.pipe(map(ClientId => ({ ClientId }))),

      // RigId observable
      this.fg_fields.get('RigId').valueChanges.pipe(map(RigId => ({ RigId }))),

      // Ftl observable
      this.fg_fields.get('Ftl').valueChanges.pipe(map(Ftl => ({ Ftl }))),

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

      // ToolsUsedId observable
      this.fg_fields
        .get('ToolsUsedId')
        .valueChanges.pipe(map(ToolsUsedId => ({ ToolsUsedId }))),

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

      // JSStitle3 observable
      this.fg_fields
        .get('JSStitle3')
        .valueChanges.pipe(map(JSStitle3 => ({ JSStitle3 }))),
      // JSSbody3 observable
      this.fg_fields
        .get('JSSbody3')
        .valueChanges.pipe(map(JSSbody3 => ({ JSSbody3 }))),

      // JSStitle4 observable
      this.fg_fields
        .get('JSStitle4')
        .valueChanges.pipe(map(JSStitle4 => ({ JSStitle4 }))),
      // JSSbody4 observable
      this.fg_fields
        .get('JSSbody4')
        .valueChanges.pipe(map(JSSbody4 => ({ JSSbody4 }))),

      // JSStitle5 observable
      this.fg_fields
        .get('JSStitle5')
        .valueChanges.pipe(map(JSStitle5 => ({ JSStitle5 }))),
      // JSSbody5 observable
      this.fg_fields
        .get('JSSbody5')
        .valueChanges.pipe(map(JSSbody5 => ({ JSSbody5 }))),

      // JSStitle6 observable
      this.fg_fields
        .get('JSStitle6')
        .valueChanges.pipe(map(JSStitle6 => ({ JSStitle6 }))),
      // JSSbody6 observable
      this.fg_fields
        .get('JSSbody6')
        .valueChanges.pipe(map(JSSbody6 => ({ JSSbody6 }))),

      // JSStitle7 observable
      this.fg_fields
        .get('JSStitle7')
        .valueChanges.pipe(map(JSStitle7 => ({ JSStitle7 }))),
      // JSSbody7 observable
      this.fg_fields
        .get('JSSbody7')
        .valueChanges.pipe(map(JSSbody7 => ({ JSSbody7 }))),

      // JSStitle8 observable
      this.fg_fields
        .get('JSStitle8')
        .valueChanges.pipe(map(JSStitle8 => ({ JSStitle8 }))),
      // JSSbody8 observable
      this.fg_fields
        .get('JSSbody8')
        .valueChanges.pipe(map(JSSbody8 => ({ JSSbody8 }))),

      // LocationId observable
      this.fg_fields
        .get('LocationId')
        .valueChanges.pipe(map(LocationId => ({ LocationId }))),

      // EngineersId observable
      this.fg_fields
        .get('EngineersId')
        .valueChanges.pipe(map(EngineersId => ({ EngineersId }))),

      // OperatorsId observable
      this.fg_fields
        .get('OperatorsId')
        .valueChanges.pipe(map(OperatorsId => ({ OperatorsId })))
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
