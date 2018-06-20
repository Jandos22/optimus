import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromPeople from '../../store';

// rxjs 6
import { Subscription, Observable } from 'rxjs';
import {
  debounceTime,
  map,
  tap,
  skipWhile,
  distinctUntilChanged
} from 'rxjs/operators';

@Component({
  selector: 'app-people-toolbar',
  styleUrls: ['people-toolbar.component.css'],
  template: `
    <mat-toolbar class="my-toolbar">
        <mat-toolbar-row>

          <div fxFlexFill fxLayout="row" fxLayoutAlign="start center">

            <span>
              <button mat-icon-button (click)="onOpenForm('new')" color="warn">
                <mat-icon>add</mat-icon>
              </button>
            </span>

            <app-people-search
                [parent]="paramsForm">
            </app-people-search>

            <span fxFlex></span>

            <app-people-top-select
              [top]="paramsForm.get('top').value"
              (onSelectTop)="onSelectTop($event)">
            </app-people-top-select>

          </div>

        </mat-toolbar-row>
    </mat-toolbar>
    `
})
export class PeopleToolbarComponent implements OnInit, OnDestroy {
  paramsForm = new FormGroup({
    query: new FormControl(''),
    location: new FormControl(''),
    top: new FormControl(25)
  });

  @Output() openForm = new EventEmitter<string>();

  // when params change,
  // update store with new params values
  // same action activates in search effects
  params$: Subscription = this.paramsForm.valueChanges
    .pipe(
      debounceTime(600),
      distinctUntilChanged(),
      skipWhile(_ => this.paramsForm.get('query').invalid === true)
    )
    .subscribe(params => {
      console.log('params updated');
      this.peopleStore.dispatch(new fromPeople.UpdateParams(params));
    });

  // comes from STORE.application.location
  // controlled from *HEADER select menu
  selectedLocation$: Subscription;

  constructor(
    private peopleStore: Store<fromPeople.PeopleState>,
    private rootStore: Store<fromRoot.RootState>
  ) {}

  ngOnInit() {
    // subscribe to store and update selected location on change
    this.selectedLocation$ = this.rootStore
      .select(fromRoot.selectSelectedId)
      .subscribe(location => {
        this.paramsForm.get('location').setValue(location);
      });
  }

  // triggered from child component
  onSelectTop(top) {
    this.paramsForm.get('top').setValue(top);
  }

  onOpenForm(state) {
    this.openForm.emit(state);
  }

  ngOnDestroy() {
    this.selectedLocation$.unsubscribe();
    this.params$.unsubscribe();
  }
}
