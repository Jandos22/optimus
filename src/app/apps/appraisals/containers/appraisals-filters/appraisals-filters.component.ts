// core
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
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
import * as fromAppraisals from '../../store';

// interface
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { AppraisalsSearchParams } from '../../../../shared/interface/appraisals.model';
import { PeopleItem } from '../../../../shared/interface/people.model';
import { AppraisalRights } from '../../store';

@Component({
  selector: 'app-appraisals-filters',
  styleUrls: ['appraisals-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-appraisals-filters-header fxFlex="65px" class="common-filters-header"
        (toggleFilters)="toggleFilters.emit()">
    </app-appraisals-filters-header>

    <app-appraisals-filters-content fxFlex class="common-filters-content"
        [fg_filters]="fg_filters" [locofinterest]="locofinterest$ | async"
        [selfUser]="selfUser$ | async" [reset]="reset"
        [position]="position"
        (updateLocationsofinterest)="updateLocationsofinterest($event)"
        (onSelectGivenBy)="onSelectGivenBy($event)"
        (onSelectGivenFor)="onSelectGivenFor($event)">
    </app-appraisals-filters-content>

    <app-appraisals-filters-footer fxFlex="49px" class="common-filters-footer"
      (onResetFilters)="onResetFilters($event)"
      (toggleFilters)="toggleFilters.emit()">
    </app-appraisals-filters-footer>
    `
})
export class AppraisalsFiltersComponent implements OnInit {
  @Input()
  currentUser: PeopleItem;

  @Input()
  position: AppraisalRights;

  @Output()
  toggleFilters = new EventEmitter<any>();

  fg_filters: FormGroup;
  $fg_filters: Subscription;

  selfUser$: Observable<PeopleItem>;

  // from store.root.locations.selected
  $locofinterest: Subscription;
  locofinterest$: Observable<number[]>;

  reset = false;

  constructor(
    private fb: FormBuilder,
    private store_root: Store<fromRoot.RootState>,
    private store_jobs: Store<fromAppraisals.AppraisalsState>
  ) {}

  ngOnInit() {
    console.log('appraisals filters initialization');
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
      .subscribe((params: AppraisalsSearchParams) => {
        this.store_jobs.dispatch(new fromAppraisals.UpdateParams(params));
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
      afterDate: '',
      beforeDate: '',
      ...this.getGivenForByParams()
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

  onSelectGivenBy(givenby: number) {
    this.fg_filters.controls['givenby'].patchValue(givenby);
  }

  onSelectGivenFor(givenfor: number) {
    this.fg_filters.controls['givenfor'].patchValue(givenfor);
  }

  onResetFilters(event) {
    this.reset = this.reset ? false : true;
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
}
