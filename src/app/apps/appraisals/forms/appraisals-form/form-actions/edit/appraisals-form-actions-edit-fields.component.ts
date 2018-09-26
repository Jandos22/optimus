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
import * as fromAppraisals from '../../../../store';

// rxjs
import { Subscription, Observable, merge } from 'rxjs';
import { map, scan } from 'rxjs/operators';

// interfaces
import { AppraisalItem } from '../../../../../../shared/interface/appraisals.model';

@Component({
  selector: 'app-appraisals-form-actions-edit-fields',
  template: ``
})
export class AppraisalsFormActionsEditFieldsComponent
  implements OnInit, OnDestroy {
  @Input()
  fg_fields: FormGroup;
  @Input()
  initialFields: AppraisalItem;

  @Output()
  whenUnsavedFieldsChange = new EventEmitter<Object>();

  // combination of individual form control changes
  fc_changes$: Observable<Object>;

  // subscribe to result of scan and map operators
  $maybeUnsavedFields: Subscription;

  constructor(private store: Store<fromAppraisals.AppraisalsState>) {}

  ngOnInit() {
    this.fc_changes$ = merge(
      // Date observable
      this.fg_fields.get('Date').valueChanges.pipe(map(Date => ({ Date }))),

      // JobId observable
      this.fg_fields.get('JobId').valueChanges.pipe(map(JobId => ({ JobId }))),

      // GivenForId observable
      this.fg_fields
        .get('GivenForId')
        .valueChanges.pipe(map(GivenForId => ({ GivenForId }))),

      // GivenById observable
      this.fg_fields
        .get('GivenById')
        .valueChanges.pipe(map(GivenById => ({ GivenById }))),

      // OverallPerformance observable
      this.fg_fields
        .get('OverallPerformance')
        .valueChanges.pipe(map(OverallPerformance => ({ OverallPerformance }))),

      // FurtherDevelopment observable
      this.fg_fields
        .get('FurtherDevelopment')
        .valueChanges.pipe(map(FurtherDevelopment => ({ FurtherDevelopment }))),

      // OperatorComments observable
      this.fg_fields
        .get('OperatorComments')
        .valueChanges.pipe(map(OperatorComments => ({ OperatorComments }))),

      // Safety observable
      this.fg_fields
        .get('Safety')
        .valueChanges.pipe(map(Safety => ({ Safety }))),

      // SafetyDetails observable
      this.fg_fields
        .get('SafetyDetails')
        .valueChanges.pipe(map(SafetyDetails => ({ SafetyDetails }))),

      // Proactivity observable
      this.fg_fields
        .get('Proactivity')
        .valueChanges.pipe(map(Proactivity => ({ Proactivity }))),

      // ProactivityDetails observable
      this.fg_fields
        .get('ProactivityDetails')
        .valueChanges.pipe(map(ProactivityDetails => ({ ProactivityDetails }))),

      // Quality observable
      this.fg_fields
        .get('Quality')
        .valueChanges.pipe(map(Quality => ({ Quality }))),

      // QualityDetails observable
      this.fg_fields
        .get('QualityDetails')
        .valueChanges.pipe(map(QualityDetails => ({ QualityDetails }))),

      // WinchDriving observable
      this.fg_fields
        .get('WinchDriving')
        .valueChanges.pipe(map(WinchDriving => ({ WinchDriving }))),

      // WinchDrivingDetails observable
      this.fg_fields
        .get('WinchDrivingDetails')
        .valueChanges.pipe(
          map(WinchDrivingDetails => ({ WinchDrivingDetails }))
        ),

      // DidRopeSocket observable
      this.fg_fields
        .get('DidRopeSocket')
        .valueChanges.pipe(map(DidRopeSocket => ({ DidRopeSocket }))),

      // DidRopeSocketH2S observable
      this.fg_fields
        .get('DidRopeSocketH2S')
        .valueChanges.pipe(map(DidRopeSocketH2S => ({ DidRopeSocketH2S }))),

      // DidCollector observable
      this.fg_fields
        .get('DidCollector')
        .valueChanges.pipe(map(DidCollector => ({ DidCollector }))),

      // DidHead observable
      this.fg_fields
        .get('DidHead')
        .valueChanges.pipe(map(DidHead => ({ DidHead }))),

      // LocationId observable
      this.fg_fields
        .get('LocationId')
        .valueChanges.pipe(map(LocationId => ({ LocationId })))
    );

    this.$maybeUnsavedFields = this.fc_changes$
      .pipe(
        scan((acc: AppraisalItem, curr) => {
          const key = Object.keys(curr).toString();
          if (this.initialFields[key] !== curr[key]) {
            return { ...acc, ...curr };
          } else if (this.initialFields[key] === curr[key]) {
            let rest;
            ({ [key]: key, ...rest } = acc);
            return rest;
          }
        }, {}),
        map((fields: AppraisalItem | {}) => {
          if (Object.keys(fields).length >= 1) {
            return { ...fields, id: this.initialFields['ID'] };
          } else {
            return fields;
          }
        })
      )
      .subscribe((fields: AppraisalItem | {}) => {
        // console.log(fields);
        this.whenUnsavedFieldsChange.emit(fields);
      });
  }

  ngOnDestroy() {
    this.$maybeUnsavedFields.unsubscribe();
  }
}
