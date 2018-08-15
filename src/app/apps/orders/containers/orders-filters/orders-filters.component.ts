// core
import {
  Component,
  Input,
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
import * as fromOrders from '../../store';

// interface
import { LocationEnt } from '../../../../shared/interface/locations.model';
import {
  OrdersSearchParams,
  OrderStatus
} from '../../../../shared/interface/orders.model';
import { PeopleItem } from '../../../../shared/interface/people.model';

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
      (onResetFilters)="onResetFilters($event)">
    </app-orders-filters-footer>
    `
})
export class OrdersFiltersComponent implements OnInit {
  @Input()
  orderStatuses: OrderStatus[];

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
    private store_orders: Store<fromOrders.OrdersState>
  ) {}

  ngOnInit() {
    console.log('orders filters initialization');
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
      .subscribe((params: OrdersSearchParams) => {
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
    this.fg_filters = this.fb.group({
      locations: [{ value: [] }],
      top: 100,
      lastUpdate: '',
      partNumber: '',
      orderStatus: '',
      requestors: ''
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

  onSelectRequestors(requestors: number[]) {
    this.fg_filters.controls['requestors'].patchValue(requestors);
  }

  onResetFilters(event) {
    this.doReset = this.doReset ? false : true;
    this.fg_filters.controls['lastUpdate'].reset();
    this.fg_filters.controls['partNumber'].reset();
    this.fg_filters.controls['orderStatus'].reset();
    this.fg_filters.controls['requestors'].patchValue([]);
  }
}
