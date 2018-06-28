import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromLayoutActions from '../../../../store/actions/layout.actions';

@Component({
  selector: 'app-timeline-toolbar-search',
  styleUrls: ['timeline-toolbar-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [formGroup]="fg_params" fxLayout="row" fxLayoutAlign="start center"
        class="timeline-header__search--container"
        [ngClass]="{
            focused: focus
        }">
        <span class="timeline__button bars">
            <button mat-icon-button (click)="toggleSidenav()">
                <span class="fa_regular"><fa-icon [icon]="['fas', 'bars']"></fa-icon></span>
            </button>
        </span>

        <input class="timeline-header__search--form"
            autofocus
            type="text"
            [placeholder]="appName"
            formControlName="query"
            autocomplete="off"
            (focus)="onFocus()" (blur)="onBlur()">

        <span *ngIf="fg_params.get('query').invalid && fg_params.get('query').value"
            class="timeline__button clear warn">
            <button mat-icon-button [matTooltip]="errorMessage()"
                (click)="clearQuery()">
                <span class="fa_regular"><fa-icon [icon]="['fas', 'times']"></fa-icon></span>
            </button>
        </span>

        <span *ngIf="fg_params.get('query').value && fg_params.get('query').valid"
            class="timeline__button clear">
            <button mat-icon-button aria-label="Clear"
                (click)="clearQuery()">
                <span class="fa_regular"><fa-icon [icon]="['fas', 'times']"></fa-icon></span>
            </button>
        </span>

        <span class="timeline__button filter">
            <button mat-icon-button>
                <span class="fa_regular"><fa-icon [icon]="['fas', 'filter']"></fa-icon></span>
            </button>
        </span>
    </div>
    `
})
export class TimelineToolbarSearchComponent implements OnInit {
  @Input() appName: string;
  @Input() fg_params: FormGroup;

  constructor(private store_root: Store<fromRoot.RootState>) {}

  focus = false;

  ngOnInit() {
    //   this.fg_params.get('query').
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
  }

  toggleSidenav() {
    this.store_root.dispatch(new fromLayoutActions.ToggleSidenav());
  }

  clearQuery() {
    this.fg_params.get('query').patchValue('');
  }

  errorMessage() {
    const control = this.fg_params.controls['query'];

    const onlySearchable = control.hasError('onlySearchable');

    return control.dirty
      ? onlySearchable
        ? 'Only letters, numbers and #, -, _ are allowed'
        : ''
      : '';
  }
}
