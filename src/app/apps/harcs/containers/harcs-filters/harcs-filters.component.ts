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
import * as fromHarcs from '../../store';

// interface
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { HarcsSearchParams } from '../../../../shared/interface/harcs.model';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-harcs-filters',
  styleUrls: ['harcs-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-harcs-filters-header fxFlex="65px" class="common-filters-header"
        (toggleFilters)="toggleFilters.emit()">
    </app-harcs-filters-header>

    <app-harcs-filters-content fxFlex class="common-filters-content"
        [fg_filters]="fg_filters" [locofinterest]="locofinterest$ | async"
        [selfUser]="selfUser$ | async" [doReset]="doReset"
        (updateLocationsofinterest)="updateLocationsofinterest($event)"
        (onSelectPic)="onSelectPic($event)">
    </app-harcs-filters-content>

    <app-harcs-filters-footer fxFlex="49px" class="common-filters-footer"
      (onResetFilters)="onResetFilters($event)"
      (toggleFilters)="toggleFilters.emit()">
    </app-harcs-filters-footer>
    `
})
export class HarcsFiltersComponent implements OnInit {
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
    private store_harcs: Store<fromHarcs.HarcsState>
  ) {}

  ngOnInit() {
    console.log('harcs filters initialization');
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
      .subscribe((params: HarcsSearchParams) => {
        this.store_harcs.dispatch(new fromHarcs.UpdateParams(params));
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
      locations: '',
      top: 100,
      status: [{ value: [] }],
      pic: [{ value: [] }],
      beforeDate: '',
      afterDate: ''
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

  onSelectPic(pic: number[]) {
    this.fg_filters.controls['pic'].patchValue(pic);
  }

  onResetFilters(event) {
    this.doReset = this.doReset ? false : true;
    this.fg_filters.controls['status'].patchValue([]);
    this.fg_filters.controls['pic'].patchValue([]);
    this.fg_filters.controls['beforeDate'].patchValue('');
    this.fg_filters.controls['afterDate'].patchValue('');
  }
}
