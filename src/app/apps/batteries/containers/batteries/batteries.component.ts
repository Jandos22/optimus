import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  HostBinding
} from "@angular/core";

// router
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

// rxjs
import { Subscription, Observable } from "rxjs";
import { take, switchMap, map } from "rxjs/operators";

// ngrx
import { Store, select } from "@ngrx/store";
import * as fromRoot from "../../../../store";
import * as fromBatteries from "../../store";

// material
import { MatDialog } from "@angular/material";

// form component
import { BatteriesFormComponent } from "../../forms";

// interfaces
import {
  BatteryItem,
  BatteriesSearchParams
} from "../../../../shared/interface/batteries.model";
import { PaginationState } from "../../store/reducers/pagination.reducer";
import { PeopleItem } from "../../../../shared/interface/people.model";

@Component({
  selector: "app-batteries.common-app-v2-container",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["batteries.component.scss"],
  template: `
    <app-batteries-header
      fxFlex="65px"
      class="common-header"
      [appName]="appName"
      [searching]="searching"
      [accessLevel]="(user$ | async).Position?.AccessLevel"
      (openForm)="openForm('new', $event)"
      (toggleFilters)="toggleFilters()"
    >
    </app-batteries-header>

    <app-batteries-filters
      fxFlex="65.5px"
      fxLayout="row nowrap"
      fxLayoutAlign="start start"
    ></app-batteries-filters>

    <app-batteries-list
      fxFlex
      class="common-content"
      [batteries]="data"
      (openForm)="openForm('view', $event)"
    >
    </app-batteries-list>

    <app-batteries-footer
      fxFlex="49px"
      class="common-footer"
      [pagination]="pagination"
      [top]="params.top"
      [searching]="searching"
      (onNext)="onNext()"
      (onBack)="onBack()"
    >
    </app-batteries-footer>
  `
})
export class BatteriesComponent implements OnInit, OnDestroy {
  appName = "Batteries";

  user$: Observable<PeopleItem>;

  $data: Subscription;
  data: BatteryItem[];

  $searching: Subscription;
  searching: boolean;

  $params: Subscription;
  params: BatteriesSearchParams;

  $pagination: Subscription;
  pagination: PaginationState;

  $status: Subscription;

  // when showFilters toggle it toggles class in host element
  @HostBinding("class.filtersOpened")
  showFilters = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_batteries: Store<fromBatteries.BatteriesState>,
    public form: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

    this.user$ = this.store_root.pipe(select(fromRoot.getUserOptimus));

    // main data = array of batteries
    this.$data = this.store_batteries
      .pipe(select(fromBatteries.selectAllBatteries))
      .subscribe(data => {
        this.data = data;
      });

    this.$pagination = this.store_batteries
      .pipe(select(fromBatteries.getPagination))
      .subscribe(pagination => (this.pagination = pagination));

    this.$searching = this.store_batteries
      .select(fromBatteries.getBatteriesSearching)
      .subscribe(search => {
        this.searching = search;
      });

    // monitor params for top
    this.$params = this.store_batteries
      .select(fromBatteries.getParams)
      .subscribe(params => {
        this.params = params;
      });

    // monitor URL change and get Battery Status
    this.$status = this.route.paramMap
      .pipe(map((params: ParamMap) => params.get("status")))
      .subscribe((status: string) => {
        this.store_batteries.dispatch(
          new fromBatteries.UpdateParams({ status })
        );
      });
  }

  onNext() {
    this.store_batteries.dispatch(
      new fromBatteries.OnNext(
        this.pagination.links[this.pagination.currentIndex + 1]
      )
    );
  }

  onBack() {
    this.store_batteries.dispatch(
      new fromBatteries.OnBack(
        this.pagination.links[this.pagination.currentIndex - 1]
      )
    );
  }

  countTotalItems(params) {
    if (params) {
      this.store_batteries.dispatch(new fromBatteries.BeginCount(params));
    }
  }

  openForm(mode, item?): void {
    const data = { mode, item };
    console.log(data);
    const formRef = this.form.open(BatteriesFormComponent, {
      data,
      disableClose: true,
      autoFocus: false
    });
    formRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        console.log(res);
      });
  }

  ngOnDestroy() {
    this.$pagination.unsubscribe();
    this.$data.unsubscribe();
    this.$params.unsubscribe();
    this.$searching.unsubscribe();
    this.$status.unsubscribe();
  }
}
