// core
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import * as _ from 'lodash';

// forms
import { FormBuilder, FormGroup } from '@angular/forms';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { take, tap, withLatestFrom, debounceTime } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromOrders from '../../store';

// interface
import { LocationEnt } from '../../../../shared/interface/locations.model';
import {
  OrdersSearchParams,
  OrderStatus
} from '../../../../shared/interface/orders.model';
import { PeopleItem } from '../../../../shared/interface/people.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders-filters',
  styleUrls: ['orders-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-orders-filters-header fxFlex="65px" class="common-filters-header"
        (toggleFilters)="toggleFilters.emit()">
    </app-orders-filters-header>

    <app-orders-filters-content fxFlex class="common-filters-content"
        [fg_filters]="fg_filters" [locofinterest]="locofinterest$ | async"
        [selfUser]="selfUser$ | async" [doReset]="doReset"
        [orderStatuses]="orderStatuses"
        (updateLocationsofinterest)="updateLocationsofinterest($event)"
        (onSelectRequestors)="onSelectRequestors($event)">
    </app-orders-filters-content>

    <app-orders-filters-footer fxFlex="49px" class="common-filters-footer"
      (onResetFilters)="resetFgFilters()"
      (toggleFilters)="toggleFilters.emit()">
    </app-orders-filters-footer>
    `
})
export class OrdersFiltersComponent implements OnInit, OnChanges {
  @Input()
  orderStatuses: OrderStatus[];

  // incoming route params
  @Input()
  lastUpdated: number;

  @Input()
  filterParams: OrdersSearchParams;

  @Output()
  toggleFilters = new EventEmitter<any>();

  @Output()
  onFiltersUpdate = new EventEmitter<OrdersSearchParams>();

  fg_filters: FormGroup;
  $fg_filters: Subscription;

  selfUser$: Observable<PeopleItem>;

  // from store.root.locations.selected
  $locofinterest: Subscription;
  locofinterest$: Observable<number[]>;
  locations: number[];

  doReset = false;

  constructor(
    private fb: FormBuilder,
    private store_root: Store<fromRoot.RootState>,
    private store_orders: Store<fromOrders.OrdersState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.startObservables();
    this.startSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filterParams) {
      console.log('FILTERS PARAMS CHANGED');
      console.log(changes.filterParams.previousValue);
      console.log(changes.filterParams.currentValue);
      this.onUrlParamsChange(changes.filterParams.currentValue);
    }
  }

  onUrlParamsChange(params: OrdersSearchParams) {
    console.log('ON URL PARAMS CHANGE');
    // params can be {} or e.g. { locations: [2,4], ...other }

    // check if params is empty
    const isEmpty = _.isEmpty(params);
    console.log('IS EMPTY? ' + isEmpty);

    // if fg_filters not created yet
    // then we should create fg_filters with default params
    console.log('IS FG_FILTERS not present? ' + !this.fg_filters);
    if (!this.fg_filters) {
      this.createFormGroup();
    }

    // here we always assume that fg_filters are inited
    // whatever values they had, apply incoming params

    // if params is empty, then reset fg_filters to default
    // leaving locations equal to locations of intereset
    // and also top equal to 100
    if (isEmpty) {
      this.resetFgFilters();
    } else {
      this.updateFgFilters(params);
    }
  }

  startObservables() {
    // locations of interest are default for locations filter
    this.locofinterest$ = this.store_root.pipe(
      select(fromRoot.selectLocationsSelectedIds),
      tap(locations => {
        this.updateFgFiltersLocations(locations);
        this.locations = locations;
      })
    );

    // get self user item to use in project reporters selection
    this.selfUser$ = this.store_root.pipe(select(fromRoot.getUserOptimus));
  }

  startSubscriptions() {
    // when change, then update params in store
    this.fg_filters.valueChanges
      .pipe(debounceTime(300))
      .subscribe((params: OrdersSearchParams) => {
        console.log('FG_FILTERS changed');
        console.log(params);
        // modify URL with new params
        this.onFiltersUpdate.emit(params);
        this.store_orders.dispatch(new fromOrders.UpdateParams(params));
      });

    // subscribe to change of Locations.selected
    this.$locofinterest = this.locofinterest$.subscribe();
  }

  killSubscriptions() {
    this.$fg_filters.unsubscribe();
    this.$locofinterest.unsubscribe();
  }

  createFormGroup() {
    console.log('CREATING FG_FILTERS');

    this.fg_filters = this.fb.group({
      text: '',
      locations: [{ value: [] }],
      top: 100,
      lastUpdate: '',
      partNumber: '',
      orderNumber: '',
      orderStatus: '',
      requestors: ''
    });

    console.log(this.fg_filters.value);
  }

  updateFgFiltersLocations(locations: number[]) {
    console.log(locations);
    this.fg_filters.controls['locations'].patchValue(locations);
  }

  updateLocationsofinterest(locations: number[]) {
    // refactor to don't update if already equal
    console.log(locations);
    this.store_root.dispatch(new fromRoot.UpdateSelected(locations));
  }

  onSelectRequestors(requestors: number[]) {
    this.fg_filters.controls['requestors'].patchValue(requestors);
  }

  resetFgFilters() {
    this.doReset = this.doReset ? false : true;
    this.fg_filters.controls['text'].reset();
    this.fg_filters.controls['locations'].patchValue(this.locations);
    this.fg_filters.controls['top'].patchValue(100);
    this.fg_filters.controls['orderNumber'].reset();
    this.fg_filters.controls['orderStatus'].reset();
    this.fg_filters.controls['lastUpdate'].reset();
    this.fg_filters.controls['partNumber'].reset();
    this.fg_filters.controls['requestors'].patchValue([]);
  }

  updateFgFilters(params: OrdersSearchParams) {
    // iterate through each property of params
    // then check if values are different
    // if different, then update
    _.each(params, (value, key) => {
      // update only if values are different
      const oldValue = this.fg_filters.controls[key].value;
      const isEqual = _.isEqual(oldValue, value);
      if (!isEqual) {
        this.fg_filters.controls[key].patchValue(value);
      }
    });

    if (_.has(params, 'text') !== true) {
      this.fg_filters.controls['text'].reset();
    }

    // if locations are not in params
    // then force update of locations filter
    if (_.has(params, 'locations') !== true) {
      console.log('forced update locations');
      this.fg_filters.controls['locations'].patchValue(this.locations);
    }

    // if top is not in params
    // then force update of top filter
    if (_.has(params, 'top') !== true) {
      console.log('force update top');
      this.fg_filters.controls['top'].patchValue(100);
    }

    if (_.has(params, 'orderNumber') !== true) {
      this.fg_filters.controls['orderNumber'].reset();
    }

    if (_.has(params, 'orderStatus') !== true) {
      this.fg_filters.controls['orderStatus'].reset();
    }

    if (_.has(params, 'lastUpdate') !== true) {
      this.fg_filters.controls['lastUpdate'].reset();
    }

    if (_.has(params, 'partNumber') !== true) {
      this.fg_filters.controls['partNumber'].reset();
    }

    if (_.has(params, 'requestors') !== true) {
      this.fg_filters.controls['requestors'].patchValue([]);
    }
  }
}
