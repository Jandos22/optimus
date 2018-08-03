// core
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';

// forms
import { FormBuilder, FormGroup } from '@angular/forms';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { take, tap, withLatestFrom, debounceTime } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromTimeline from '../../store';

// interface
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { TimelineSearchParams } from '../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-filters',
  styleUrls: ['timeline-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-timeline-filters-header fxFlex="65px" class="common-filters-header"
        (toggleFilters)="toggleFilters.emit()">
    </app-timeline-filters-header>

    <app-timeline-filters-content fxFlex class="common-filters-content"
        [fg_filters]="fg_filters" [locofinterest]="locofinterest$ | async">
    </app-timeline-filters-content>

    <app-timeline-filters-footer fxFlex="49px" class="common-filters-footer">
    </app-timeline-filters-footer>
    `
})
export class TimelineFiltersComponent implements OnInit {
  @Output() toggleFilters = new EventEmitter<any>();

  fg_filters: FormGroup;
  $fg_filters: Subscription;

  // from store.root.locations.selected
  $locofinterest: Subscription;
  locofinterest$: Observable<number[]>;

  constructor(
    private fb: FormBuilder,
    private store_root: Store<fromRoot.RootState>,
    private store_timeline: Store<fromTimeline.TimelineState>
  ) {}

  ngOnInit() {
    console.log('timeline filters initialization');
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
  }

  startSubscriptions() {
    // when change, then update params in store
    this.fg_filters.valueChanges
      .pipe(debounceTime(300))
      .subscribe((params: TimelineSearchParams) => {
        this.store_timeline.dispatch(new fromTimeline.UpdateParams(params));
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
      top: 100
    });
  }

  updateFgFiltersLocations(locations: number[]) {
    this.fg_filters.controls['locations'].patchValue(locations);
  }
}
