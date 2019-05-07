import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

// rxjs
import { Observable, Subscription } from "rxjs";
import { map, tap } from "rxjs/operators";

// ngrx
import { Store, select } from "@ngrx/store";
import * as fromRoot from "../../../../store";
import * as fromBatteries from "../../store";

// constants
import { batteryStatuses } from "../../constants/battery-statuses.constants";

@Component({
  selector: "app-batteries-filters",
  templateUrl: "./batteries-filters.component.html",
  styleUrls: ["./batteries-filters.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatteriesFiltersComponent implements OnInit, OnDestroy {
  private statuses: string[] = batteryStatuses;

  fg_filters: FormGroup;

  status$: Observable<string>;
  $status: Subscription;

  url$: Observable<string>;
  $url: Subscription;

  locofinterest$: Observable<number[]>;
  $locofinterest: Subscription;

  constructor(
    private fb: FormBuilder,
    private store_root: Store<fromRoot.RootState>,
    private store_batteries: Store<fromBatteries.BatteriesState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initFgFilters();
    this.initObservables();
    this.initSubscriptions();
  }

  initFgFilters() {
    this.fg_filters = this.fb.group({
      status: [""],
      locations: [{ value: [] }]
    });
  }

  initObservables() {
    this.status$ = this.fg_filters.get("status").valueChanges;

    this.url$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get("status"))
    );

    // locations of interest are default for locations filter
    this.locofinterest$ = this.store_root.pipe(
      select(fromRoot.selectLocationsSelectedIds),
      tap(locations => {
        this.updateFgFiltersLocations(locations);
        // this.locations = locations;
        this.store_batteries.dispatch(
          new fromBatteries.UpdateParams({ locations: locations })
        );
      })
    );
  }

  initSubscriptions() {
    this.$status = this.status$.subscribe(status => {
      // update URL
      this.router.navigate(["batteries", `${status}`]);
    });

    this.$url = this.url$.subscribe(status => {
      this.fg_filters.controls["status"].setValue(status);
    });

    // subscribe to change of Locations.selected
    this.$locofinterest = this.locofinterest$.subscribe();
  }

  updateLocationsofinterest(locations: number[]) {
    // later refactor to don't update if already equal
    console.log("Update Locations of Interest: " + locations);
    this.store_root.dispatch(new fromRoot.UpdateSelected(locations));
  }

  updateFgFiltersLocations(locations: number[]) {
    this.fg_filters.controls["locations"].patchValue(locations);
  }

  ngOnDestroy() {
    this.$status.unsubscribe();
    this.$url.unsubscribe();
  }
}
