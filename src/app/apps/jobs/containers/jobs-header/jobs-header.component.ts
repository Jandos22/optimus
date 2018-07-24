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
import * as fromJobs from '../../store';

// rxjs
import { Subscription, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map
} from 'rxjs/operators';

// interfaces
import { JobsSearchParams } from '../../../../shared/interface/jobs.model';

// validators
import { ValidationService } from '../../../../shared/validators/validation.service';

@Component({
  selector: 'app-jobs-header',
  styleUrls: ['jobs-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-jobs-toolbar class="common-toolbar"
      fxFlex fxFlex.gt-xs="568px"
      fxLayout="row nowrap" fxLayoutAlign="start center"
      [appName]="appName" [fg_params]="fg_params" [searching]="searching"
      [accessLevel]="accessLevel"
      (onFocus)="onFocus()" (onBlur)="onBlur()" (openForm)="openForm.emit()"
      [ngClass]="{  focused: focus,
                    invalid: fg_params.get('text').invalid }">
    </app-jobs-toolbar>
    `
})
export class JobsHeaderComponent implements OnInit, OnDestroy {
  @Input() appName: string;
  @Input() searching: boolean;
  @Input() accessLevel: number;

  @Output() openForm = new EventEmitter<any>();

  fg_params: FormGroup;

  $params: Subscription; // unsubscribed in ngOnDestroy
  $selectedLocations: Subscription; // unsubscribed in ngOnDestroy

  focus = false;

  constructor(
    private fb: FormBuilder,
    private store_jobs: Store<fromJobs.JobsState>,
    private store_root: Store<fromRoot.RootState>
  ) {
    this.initializeParamsFormGroup();
    this.subscribeToParamsFormGroup();
    this.resetParamsFormGroup();
  }

  initializeParamsFormGroup() {
    this.fg_params = this.fb.group({
      text: ['', ValidationService.onlySearchable],
      locations: [''],
      top: []
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
          console.log(params);
          return {
            text: params[0],
            locations: params[1],
            top: params[2]
          };
        })
      )
      .subscribe((params: JobsSearchParams) => {
        console.log('params updated');
        // this action updates store > jobs.params
        // this action is intercepted in search effects
        // search effects triggers chain of actions needed
        // to request jobs from server and load them in store
        this.store_jobs.dispatch(new fromJobs.UpdateParams(params));
      });
  }

  ngOnInit() {
    this.subscribeToSelectedLocations();
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

  ngOnDestroy() {
    this.$params.unsubscribe();
    this.$selectedLocations.unsubscribe();
  }
}
