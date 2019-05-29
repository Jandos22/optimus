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
import {
  take,
  tap,
  withLatestFrom,
  debounceTime,
  filter
} from 'rxjs/operators';

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
    <app-appraisals-filters-header
      fxFlex="65px"
      class="common-filters-header"
      (toggleFilters)="toggleFilters.emit()"
    >
    </app-appraisals-filters-header>

    <app-appraisals-filters-content
      fxFlex
      class="common-filters-content"
      [fg_filters]="fg_filters"
      [locofinterest]="locofinterest$ | async"
      [selfUser]="selfUser$ | async"
      [currentUser]="currentUser"
      [reset]="reset"
      [resetGivenFor]="resetGivenFor"
      [position]="position"
      [byWhom]="byWhom"
      (onByChange)="onByChange($event)"
      (onSelectGivenBy)="onSelectGivenBy($event)"
      (onSelectGivenFor)="onSelectGivenFor($event)"
    >
    </app-appraisals-filters-content>

    <app-appraisals-filters-footer
      fxFlex="49px"
      class="common-filters-footer"
      (onResetFilters)="onResetFilters($event)"
      (toggleFilters)="toggleFilters.emit()"
    >
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
  resetGivenFor: boolean = true;

  byWhom: string;

  constructor(
    private fb: FormBuilder,
    private store_root: Store<fromRoot.RootState>,
    private store_appraisals: Store<fromAppraisals.AppraisalsState>
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
      select(fromRoot.selectLocationsSelectedIds)
      // tap(locations => this.updateFgFiltersLocations(locations))
    );

    // get self user item to use in project reporters selection
    this.selfUser$ = this.store_root.pipe(select(fromRoot.getUserOptimus));
  }

  startSubscriptions() {
    // when change, then update params in store
    this.fg_filters.valueChanges
      .pipe(
        debounceTime(300),
        filter(
          (filter: AppraisalsSearchParams) =>
            filter.givenby !== 0 || filter.givenfor !== 0
        )
      )
      .subscribe((params: AppraisalsSearchParams) => {
        console.log(params);
        this.store_appraisals.dispatch(new fromAppraisals.UpdateParams(params));
      });

    // this.modifyGivenForGivenBy();

    // subscribe to change of Locations.selected
    this.$locofinterest = this.locofinterest$.subscribe();
  }

  killSubscriptions() {
    this.$fg_filters.unsubscribe();
    this.$locofinterest.unsubscribe();
  }

  createFormGroup() {
    this.fg_filters = this.fb.group({
      // locations: '',
      top: 25,
      afterDate: '',
      beforeDate: '',
      givenby: 0,
      givenfor: '',
      chooseFrom: []
    });
    console.log(this.fg_filters.value);
  }

  onByChange(byWhom: string) {
    console.log(byWhom);

    this.byWhom = byWhom;

    if (byWhom === 'byMe' && (this.position.isFEFS || this.position.isOther)) {
      this.fg_filters.controls['givenby'].patchValue(this.currentUser.Id);
      this.fg_filters.controls['givenfor'].patchValue(0);
      this.fg_filters.controls['chooseFrom'].patchValue([]);
    }

    if (
      byWhom === 'byOthers' &&
      (this.position.isFEFS || this.position.isOther)
    ) {
      this.store_appraisals.dispatch(new fromAppraisals.DeleteAllAppraisals());
      this.toggleResetGivenFor();

      this.fg_filters.controls['givenby'].patchValue(0);
      this.fg_filters.controls['givenfor'].patchValue(0);

      this.fg_filters.controls['chooseFrom'].patchValue(
        this.currentUser.DirectReportsId.results
      );
    }
  }

  onSelectGivenBy(givenby: number) {
    if (givenby) {
      this.fg_filters.controls['givenby'].patchValue(givenby);
    }
  }

  onSelectGivenFor(givenfor: number) {
    if (givenfor) {
      this.fg_filters.controls['givenfor'].patchValue(givenfor);
    }
  }

  onResetFilters(event) {
    this.reset = this.reset ? false : true;
  }

  toggleResetGivenFor() {
    this.resetGivenFor = this.resetGivenFor ? false : true;
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
    console.log(this.position);
    console.log(this.currentUser);
    if (this.position.isOther) {
      console.log('running');
      givenby = this.currentUser.Id;
    }

    console.log({ givenfor: givenfor, givenby: givenby });

    return { givenfor: givenfor, givenby: givenby };
  }

  // not pure function
  modifyGivenForGivenBy() {
    const id = this.currentUser.Id;

    // field engineers and specialist
    // can find only self created appraisals
    if (this.position.isFEFS) {
      this.fg_filters.controls['givenby'].patchValue(id);
      this.fg_filters.controls['givenfor'].patchValue('');
    }

    // operators
    // can find only appraisals created for them
    if (this.position.isOP) {
      this.fg_filters.controls['givenby'].patchValue('');
      this.fg_filters.controls['givenfor'].patchValue(id);
    }

    // if current user don't fall in any category
    // then let him/her find self old appraisals
    if (this.position.isOther) {
      this.fg_filters.controls['givenby'].patchValue(id);
      this.fg_filters.controls['givenfor'].patchValue('');
    }

    console.log(this.fg_filters.value);
  }
}
