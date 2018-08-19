import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import * as _ from 'lodash';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromOrders from '../../store';

// rxjs
import { Subscription, combineLatest, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  startWith
} from 'rxjs/operators';

// interfaces
import { OrdersSearchParams } from '../../../../shared/interface/orders.model';

// validators
import { ValidationService } from '../../../../shared/validators/validation.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-orders-header',
  styleUrls: ['orders-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-orders-toolbar class="common-toolbar"
      fxFlex fxFlex.gt-xs="568px"
      fxLayout="row nowrap" fxLayoutAlign="start center"
      [appName]="appName" [fg_params]="fg_params" [searching]="searching"
      [accessLevel]="accessLevel"
      (onFocus)="onFocus()" (onBlur)="onBlur()"
      (openForm)="openForm.emit()" (toggleFilters)="toggleFilters.emit()"
      [ngClass]="{  focused: focus,
                    invalid: fg_params.get('text').invalid }">
    </app-orders-toolbar>
    `
})
export class OrdersHeaderComponent implements OnInit, OnDestroy {
  @Input()
  appName: string;
  @Input()
  searching: boolean;
  @Input()
  accessLevel: number;

  @Output()
  openForm = new EventEmitter<any>();
  @Output()
  toggleFilters = new EventEmitter<any>();

  fg_params: FormGroup;

  $params: Subscription; // unsubscribed in ngOnDestroy
  $selectedLocations: Subscription; // unsubscribed in ngOnDestroy

  focus = false;

  $url: Subscription;
  urlParams: any;

  constructor(
    private fb: FormBuilder,
    private store_orders: Store<fromOrders.OrdersState>,
    private store_root: Store<fromRoot.RootState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.$url = this.route.paramMap
      .pipe(
        switchMap((params: any) => {
          return of(params.params);
        })
      )
      .subscribe(params => {
        this.urlParams = params;
        // console.log(params);
        if (!params.text && this.fg_params) {
          console.log(this.fg_params.controls['text']);
          this.fg_params.controls['text'].patchValue('');
        } else if (params.text && this.fg_params) {
          this.fg_params.controls['text'].patchValue(params.text);
        }
      });
  }

  initializeParamsFormGroup() {
    console.log(this.urlParams);
    this.fg_params = this.fb.group({
      text: [this.getTextFromUrl(), ValidationService.onlySearchable]
    });
  }

  getTextFromUrl() {
    if (this.urlParams && this.urlParams.text) {
      return this.urlParams.text;
    } else {
      return '';
    }
  }

  resetParamsFormGroup() {
    this.fg_params.get('text').patchValue('');
  }

  subscribeToParamsFormGroup() {
    // don't pass value after each keystroke, but wait for 600ms
    // don't pass value if it didn't change
    const text$ = this.fg_params.get('text').valueChanges.pipe(
      filter(text => {
        return this.fg_params.get('text').valid;
      }),
      debounceTime(600),
      distinctUntilChanged()
    );

    this.$params = text$
      .pipe(
        startWith(this.getTextFromUrl()),
        map(text => {
          console.log(text);
          return { text };
        })
      )
      .subscribe((q: OrdersSearchParams) => {
        console.log('search text updated');
        const text = encodeURI(q.text);
        console.log(this.urlParams);

        if (text) {
          this.router.navigate(['./orders', { ...this.urlParams, text }]);
        } else {
          this.router.navigate(['./orders', { ...this.urlParams }]);
        }
      });
  }

  ngOnInit() {
    this.initializeParamsFormGroup();
    this.subscribeToParamsFormGroup();
    // this.resetParamsFormGroup();
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
  }

  ngOnDestroy() {
    this.$params.unsubscribe();
  }
}
