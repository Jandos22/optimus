// core
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

// forms
import { FormBuilder, FormGroup } from '@angular/forms';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { take, tap, withLatestFrom, debounceTime } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromJobs from '../../store';

// interface
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { JobsSearchParams } from '../../../../shared/interface/jobs.model';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-jobs-filters',
  styleUrls: ['jobs-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-jobs-filters-header fxFlex="65px" class="common-filters-header"
        (toggleFilters)="toggleFilters.emit()">
    </app-jobs-filters-header>

    <app-jobs-filters-content fxFlex class="common-filters-content"
        [fg_filters]="fg_filters" [locofinterest]="locofinterest$ | async"
        [selfUser]="selfUser$ | async" [doReset]="doReset"
        (updateLocationsofinterest)="updateLocationsofinterest($event)"
        (onSelectEngineers)="onSelectEngineers($event)"
        (onSelectOperators)="onSelectOperators($event)">
    </app-jobs-filters-content>

    <app-jobs-filters-footer fxFlex="49px" class="common-filters-footer"
      (onResetFilters)="onResetFilters($event)">
    </app-jobs-filters-footer>
    `
})
export class JobsFiltersComponent implements OnInit {
  @Output() toggleFilters = new EventEmitter<any>();

  fg_filters: FormGroup;
  $fg_filters: Subscription;

  selfUser$: Observable<PeopleItem>;

  // from store.root.locations.selected
  $locofinterest: Subscription;
  locofinterest$: Observable<number[]>;

  doReset = false;

  constructor(
    private fb: FormBuilder,
    private store_root: Store<fromRoot.RootState>,
    private store_jobs: Store<fromJobs.JobsState>
  ) {}

  ngOnInit() {
    console.log('jobs filters initialization');
    this.createFormGroup();
    this.startObservables();
    this.startSubscriptions();
  }

  startObservables() {
    // locations of interest are default for locations filter
    this.locofinterest$ = this.store_root.pipe(
      select(fromRoot.selectLocationsSelectedIds),
      tap(locations => this.updateFgFiltersLocations(locations))
    );

    // get self user item to use in project reporters selection
    this.selfUser$ = this.store_root.pipe(select(fromRoot.getUserOptimus));
  }

  startSubscriptions() {
    // when change, then update params in store
    this.fg_filters.valueChanges
      .pipe(debounceTime(300))
      .subscribe((params: JobsSearchParams) => {
        this.store_jobs.dispatch(new fromJobs.UpdateParams(params));
      });

    // subscribe to change of Locations.selected
    this.$locofinterest = this.locofinterest$.subscribe();
  }

  killSubscriptions() {
    this.$fg_filters.unsubscribe();
    this.$locofinterest.unsubscribe();
  }

  createFormGroup() {
    this.fg_filters = this.fb.group({
      locations: [{ value: [] }],
      top: 100,
      well: '',
      engineers: [{ value: [] }],
      operators: [{ value: [] }]
    });
  }

  updateFgFiltersLocations(locations: number[]) {
    console.log(locations);
    this.fg_filters.controls['locations'].patchValue(locations);
  }

  updateLocationsofinterest(locations: number[]) {
    console.log(locations);
    this.store_root.dispatch(new fromRoot.UpdateSelected(locations));
  }

  onSelectEngineers(engineers: number[]) {
    this.fg_filters.controls['engineers'].patchValue(engineers);
  }

  onSelectOperators(operators: number[]) {
    this.fg_filters.controls['operators'].patchValue(operators);
  }

  onResetFilters(event) {
    this.doReset = this.doReset ? false : true;
    this.fg_filters.controls['well'].patchValue('');
    // this.fg_filters.controls['eventReporters'].patchValue([]);
  }
}
