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
import * as fromKaizen from '../../store';

// interface
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { KaizenSearchParams } from '../../../../shared/interface/kaizen.model';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-kaizen-filters',
  styleUrls: ['kaizen-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-kaizen-filters-header
      fxFlex="65px"
      class="common-filters-header"
      (toggleFilters)="toggleFilters.emit()"
    >
    </app-kaizen-filters-header>

    <app-kaizen-filters-content
      fxFlex
      class="common-filters-content"
      [fg_filters]="fg_filters"
      [locofinterest]="locofinterest$ | async"
      [selfUser]="selfUser$ | async"
      [doReset]="doReset"
      (updateLocationsofinterest)="updateLocationsofinterest($event)"
      (onSelectDoneBy)="onSelectDoneBy($event)"
    >
    </app-kaizen-filters-content>

    <app-kaizen-filters-footer
      fxFlex="49px"
      class="common-filters-footer"
      (onResetFilters)="onResetFilters($event)"
      (toggleFilters)="toggleFilters.emit()"
    >
    </app-kaizen-filters-footer>
  `
})
export class KaizenFiltersComponent implements OnInit {
  @Output()
  toggleFilters = new EventEmitter<any>();

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
    private store_kaizen: Store<fromKaizen.KaizenState>
  ) {}

  ngOnInit() {
    console.log('kaizen filters initialization');
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
      .subscribe((params: KaizenSearchParams) => {
        console.log('kaizen params updated: ');
        console.log(params);
        this.store_kaizen.dispatch(new fromKaizen.UpdateParams(params));
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
      top: 10,
      doneBy: [{ value: [] }]
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

  onSelectDoneBy(doneBy: number[]) {
    console.log(doneBy);
    this.fg_filters.controls['doneBy'].patchValue(doneBy);
  }

  onResetFilters(event) {
    this.doReset = this.doReset ? false : true;
  }
}
