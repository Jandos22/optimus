import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output
} from "@angular/core";
import { FormGroup } from "@angular/forms";

// ngrx
import { Store } from "@ngrx/store";
import * as fromBatteries from "../../../../store";

// rxjs
import { Subscription, Observable, merge } from "rxjs";
import { map, scan } from "rxjs/operators";

// interfaces
import { BatteryItem } from "../../../../../../shared/interface/batteries.model";

@Component({
  selector: "app-batteries-form-actions-edit-fields",
  template: ``
})
export class BatteriesFormActionsEditFieldsComponent
  implements OnInit, OnDestroy {
  @Input()
  fg_fields: FormGroup;

  @Input()
  initialFields: BatteryItem;

  @Output()
  whenUnsavedFieldsChange = new EventEmitter<Object>();

  // combination of individual form control changes
  fc_changes$: Observable<Object>;

  // subscribe to result of scan and map operators
  $maybeUnsavedFields: Subscription;

  constructor(private store: Store<fromBatteries.BatteriesState>) {}

  ngOnInit() {
    this.fc_changes$ = merge(
      this.fg_fields
        .get("Serial")
        .valueChanges.pipe(map(Serial => ({ Serial }))),
      this.fg_fields
        .get("LocationId")
        .valueChanges.pipe(map(LocationId => ({ LocationId })))
    );

    this.$maybeUnsavedFields = this.fc_changes$
      .pipe(
        scan((acc: BatteryItem, curr) => {
          const key = Object.keys(curr).toString();
          if (this.initialFields[key] !== curr[key]) {
            return { ...acc, ...curr };
          } else if (this.initialFields[key] === curr[key]) {
            let rest: any;
            ({ [key]: key, ...rest } = acc);
            return rest;
          }
        }, {}),
        map((fields: BatteryItem | {}) => {
          if (Object.keys(fields).length >= 1) {
            return { ...fields, id: this.initialFields["ID"] };
          } else {
            return fields;
          }
        })
      )
      .subscribe((fields: BatteryItem | {}) => {
        // console.log(fields);
        this.whenUnsavedFieldsChange.emit(fields);
      });
  }

  ngOnDestroy() {
    this.$maybeUnsavedFields.unsubscribe();
  }
}
