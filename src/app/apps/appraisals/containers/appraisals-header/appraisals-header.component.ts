import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromAppraisals from '../../store';

import * as _ from 'lodash';

// rxjs
import { Subscription, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map
} from 'rxjs/operators';

import { people_fefs } from './../../../../shared/constants/ids-fefs';
import { people_op } from '../../../../shared/constants/ids-op';

// validators
import { ValidationService } from '../../../../shared/validators/validation.service';

// interfaces
import { AppraisalsSearchParams } from '../../../../shared/interface/appraisals.model';
import { PeopleItem } from '../../../../shared/interface/people.model';
import { AppraisalRights } from '../../store';

@Component({
  selector: 'app-appraisals-header',
  styleUrls: ['appraisals-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-appraisals-toolbar class="common-toolbar"
      fxFlex fxFlex.gt-xs="568px"
      fxLayout="row nowrap" fxLayoutAlign="start center"
      [appName]="appName" [fg_params]="fg_params" [searching]="searching"
      [isFEFS]="position?.isFEFS"
      (onFocus)="onFocus()" (onBlur)="onBlur()" (openForm)="openForm.emit()"
      [ngClass]="{  focused: focus,
                    invalid: fg_params.get('text').invalid }">
    </app-appraisals-toolbar>
    `
})
export class AppraisalsHeaderComponent implements OnInit, OnDestroy {
  @Input() appName: string;
  @Input() searching: boolean;
  @Input() currentUser: PeopleItem;
  @Input() position: AppraisalRights;

  @Output() openForm = new EventEmitter<any>();

  fg_params: FormGroup;

  $params: Subscription; // unsubscribed in ngOnDestroy
  $selectedLocations: Subscription; // unsubscribed in ngOnDestroy

  focus = false;

  constructor(
    private fb: FormBuilder,
    private store_appraisals: Store<fromAppraisals.AppraisalsState>,
    private store_root: Store<fromRoot.RootState>
  ) {
    // this.initializeParamsFormGroup();
    // this.subscribeToParamsFormGroup();
    // this.resetParamsFormGroup();
  }

  ngOnInit() {
    this.initializeParamsFormGroup();
    this.subscribeToParamsFormGroup();
    this.resetParamsFormGroup();
    this.subscribeToSelectedLocations();
  }

  initializeParamsFormGroup() {
    this.fg_params = this.fb.group({
      text: ['', ValidationService.onlySearchable],
      locations: [''],
      top: [],
      ...this.getGivenForByParams()
    });
  }

  resetParamsFormGroup() {
    this.fg_params.get('text').patchValue('');
    this.fg_params.get('top').patchValue(100);
  }

  subscribeToParamsFormGroup() {
    // don't pass value after each keystroke, but wait for 600ms
    // don't pass value if it didn't change
    const text$ = this.fg_params.get('text').valueChanges.pipe(
      filter(text => {
        return this.fg_params.get('text').valid;
      }),
      debounceTime(600),
      distinctUntilChanged()
    );

    const locations$ = this.fg_params
      .get('locations')
      .valueChanges.pipe(distinctUntilChanged());

    const top$ = this.fg_params
      .get('top')
      .valueChanges.pipe(distinctUntilChanged());

    const params$ = combineLatest(text$, locations$, top$);

    this.$params = params$
      .pipe(
        map(params => {
          console.log('params updated');
          console.log(params);

          const newParams = {
            ...this.fg_params.value,
            text: params[0],
            locations: params[1],
            top: params[2]
          };

          console.log(newParams);

          return newParams;
        })
      )
      .subscribe((params: AppraisalsSearchParams) => {
        // this action updates store > jobs.params
        // this action is intercepted in search effects
        // search effects triggers chain of actions needed
        // to request jobs from server and load them in store
        this.store_appraisals.dispatch(new fromAppraisals.UpdateParams(params));
      });
  }

  subscribeToSelectedLocations() {
    // subscribe to store and update selected location on change
    this.$selectedLocations = this.store_root
      .pipe(select(fromRoot.selectSelectedId))
      .subscribe(location => {
        this.fg_params.get('locations').setValue(location);
      });
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
  }

  getGivenForByParams() {
    // both should start with null
    // this means CAN FIND ALL APPRAISALS
    let givenfor = null;
    let givenby = null;

    // field engineers and specialist
    // can find only self created appraisals
    if (this.position.isFEFS) {
      givenby = this.currentUser.Id;
    }

    // operators
    // can find only appraisals created for them
    if (this.position.isOP) {
      givenfor = this.currentUser.Id;
    }

    // if current user don't fall in any category
    // then let him/her find self old appraisals
    if (
      !this.position.isFEFS &&
      !this.position.isOP &&
      !this.position.isReviewer
    ) {
      givenby = this.currentUser.Id;
    }

    return { givenfor: givenfor, givenby: givenby };
  }

  ngOnDestroy() {
    this.$params.unsubscribe();
    this.$selectedLocations.unsubscribe();
  }
}
