import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromTimeline from '../../store';

// rxjs
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skipWhile } from 'rxjs/operators';

// interfaces
import { TimelineEventsParams } from './../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-toolbar',
  styleUrls: ['timeline-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div fxLayout="row" fxLayoutAlign="start center"
      class="timeline__toolbar">
        <app-timeline-toolbar-search
          [fg_params]="fg_params">
        </app-timeline-toolbar-search>
    </div>
    `
})
export class TimelineToolbarComponent implements OnInit, OnDestroy {
  fg_params: FormGroup;

  $params: Subscription; // unsubscribed in ngOnDestroy
  $selectedLocations: Subscription; // unsubscribed in ngOnDestroy

  constructor(
    private fb: FormBuilder,
    private store_timeline: Store<fromTimeline.TimelineState>,
    private store_root: Store<fromRoot.RootState>
  ) {
    this.initializeParamsFormGroup();
    this.subscribeToParamsFormGroup();
  }

  initializeParamsFormGroup() {
    this.fg_params = this.fb.group({
      query: [''],
      locations: [''],
      top: [25]
    });
  }

  subscribeToParamsFormGroup() {
    // when params change,
    // update store with new params values
    // same action activates in search effects
    this.$params = this.fg_params.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        skipWhile(_ => this.fg_params.get('query').invalid === true)
      )
      .subscribe((params: TimelineEventsParams) => {
        console.log('params updated');
        // this action updates store > timeline.params
        // this action is intercepted in search effects
        // search effects triggers chain of actions needed
        // to request events from server and load them in store
        this.store_timeline.dispatch(new fromTimeline.UpdateParams(params));
      });
  }

  ngOnInit() {
    this.subscribeToSelectedLocations();
  }

  subscribeToSelectedLocations() {
    // subscribe to store and update selected location on change
    this.$selectedLocations = this.store_root
      .pipe(select(fromRoot.selectSelectedId))
      .subscribe(location => {
        this.fg_params.get('locations').setValue(location);
      });
  }

  ngOnDestroy() {
    this.$params.unsubscribe();
    this.$selectedLocations.unsubscribe();
  }
}
