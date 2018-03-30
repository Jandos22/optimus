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

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { debounceTime, map, tap, skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-people-toolbar',
  styleUrls: ['people-toolbar.component.css'],
  template: `
    <mat-toolbar class="toolbar">
        <mat-toolbar-row class="customToolbarRowTop">

          <div fxFlexFill fxLayout="row" fxLayoutAlign="start center">

            <button mat-icon-button>
              <mat-icon>people</mat-icon>
            </button>

            <app-people-search
                [parent]="paramsForm">
            </app-people-search>

            <span fxFlex></span>

            <!--
            <app-people-top-select
              [top]="paramsForm.get('top').value"
              (onSelectTop)="onSelectTop($event)">
            </app-people-top-select>
            -->

            <span>
                <button mat-icon-button (click)="onOpenForm('new')" color="warn">
                    <mat-icon>add</mat-icon>
                </button>
            </span>

          </div>

        </mat-toolbar-row>
    </mat-toolbar>
    `
})
export class PeopleToolbarComponent implements OnInit, OnDestroy {
  paramsForm = new FormGroup({
    query: new FormControl(''),
    location: new FormControl(''),
    top: new FormControl(10)
  });

  @Output() openForm = new EventEmitter<string>();

  // when params change,
  // update store with new params values
  // same action activates in search effects
  params$: Subscription = this.paramsForm.valueChanges
    .pipe(
      debounceTime(600),
      skipWhile(_ => this.paramsForm.get('query').invalid === true)
    )
    .subscribe(params =>
      this.peopleStore.dispatch(new fromPeople.UpdateParams(params))
    );

  // comes from STORE.application.location
  // controlled from *HEADER select menu
  selectedLocation$: Subscription;

  constructor(
    private peopleStore: Store<fromPeople.PeopleState>,
    private rootStore: Store<fromRoot.RootState>
  ) {}

  onSelectTop(top) {
    this.paramsForm.get('top').setValue(top);
  }

  ngOnInit() {
    // subscribe to store and update selected location on change
    this.selectedLocation$ = this.rootStore
      .select(fromRoot.getApplicationLocation)
      .subscribe(location => {
        this.paramsForm.get('location').setValue(location);
      });
  }

  onOpenForm(state) {
    this.openForm.emit(state);
  }

  ngOnDestroy() {
    this.selectedLocation$.unsubscribe();
    this.params$.unsubscribe();
  }
}
