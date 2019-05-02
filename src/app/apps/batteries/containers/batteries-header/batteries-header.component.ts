import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";

// ngrx
import { Store, select } from "@ngrx/store";
import * as fromRoot from "../../../../store";
import * as fromBatteries from "../../store";

// rxjs
import { Subscription, combineLatest } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map
} from "rxjs/operators";

// interfaces
import { BatteriesSearchParams } from "../../../../shared/interface/batteries.model";

// validators
import { ValidationService } from "../../../../shared/validators/validation.service";

@Component({
  selector: "app-batteries-header",
  styleUrls: ["batteries-header.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-batteries-toolbar
      class="common-toolbar"
      fxFlex
      fxFlex.gt-xs="568px"
      fxLayout="row nowrap"
      fxLayoutAlign="start center"
      [appName]="appName"
      [fg_params]="fg_params"
      [searching]="searching"
      [accessLevel]="accessLevel"
      (onFocus)="onFocus()"
      (onBlur)="onBlur()"
      (openForm)="openForm.emit()"
      (toggleFilters)="toggleFilters.emit()"
      [ngClass]="{ focused: focus, invalid: fg_params.get('text').invalid }"
    >
    </app-batteries-toolbar>
  `
})
export class BatteriesHeaderComponent implements OnInit, OnDestroy {
  @Input()
  appName: string;
  @Input()
  searching: boolean;
  @Input()
  accessLevel: number;

  // @Output()
  // openForm = new EventEmitter<any>();
  // @Output()
  // toggleFilters = new EventEmitter<any>();

  fg_params: FormGroup;

  $params: Subscription; // unsubscribed in ngOnDestroy

  focus = false;

  constructor(
    private fb: FormBuilder,
    private store_batteries: Store<fromBatteries.BatteriesState>,
    private store_root: Store<fromRoot.RootState>
  ) {
    this.initializeParamsFormGroup();
    this.subscribeToParamsFormGroup();
    this.resetParamsFormGroup();
  }

  initializeParamsFormGroup() {
    this.fg_params = this.fb.group({
      text: ["", ValidationService.onlySearchable]
    });
  }

  resetParamsFormGroup() {
    this.fg_params.get("text").patchValue("");
  }

  subscribeToParamsFormGroup() {
    // don't pass value after each keystroke, but wait for 600ms
    // don't pass value if it didn't change
    const text$ = this.fg_params.get("text").valueChanges.pipe(
      filter(text => {
        return this.fg_params.get("text").valid;
      }),
      debounceTime(600),
      distinctUntilChanged()
    );

    const params$ = combineLatest(text$);

    this.$params = params$
      .pipe(
        map(params => {
          // console.log('params updated');
          // console.log(params);
          return {
            text: params[0]
          };
        })
      )
      .subscribe((params: BatteriesSearchParams) => {
        // console.log('params updated');
        // this action updates store > batteries.params
        // this action is intercepted in search effects
        // search effects triggers chain of actions needed
        // to request batteries from server and load them in store
        this.store_batteries.dispatch(new fromBatteries.UpdateParams(params));
      });
  }

  ngOnInit() {}

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
