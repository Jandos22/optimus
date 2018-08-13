import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// ngrx
import { Store } from '@ngrx/store';
import * as fromOrders from '../../../../store';

// rxjs
import { Subscription, Observable, merge } from 'rxjs';
import { map, scan } from 'rxjs/operators';

// interfaces
import { OrderItem } from '../../../../../../shared/interface/orders.model';

@Component({
  selector: 'app-orders-form-actions-edit-fields',
  template: ``
})
export class OrdersFormActionsEditFieldsComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() initialFields: OrderItem;

  @Output() whenUnsavedFieldsChange = new EventEmitter<Object>();

  // combination of individual form control changes
  fc_changes$: Observable<Object>;

  // subscribe to result of scan and map operators
  $maybeUnsavedFields: Subscription;

  constructor(private store: Store<fromOrders.OrdersState>) {}

  ngOnInit() {
    this.fc_changes$ = merge(
      // Observables

      // OrderName
      this.fg_fields
        .get('OrderName')
        .valueChanges.pipe(map(OrderName => ({ OrderName }))),

      // OrderDate
      this.fg_fields
        .get('OrderDate')
        .valueChanges.pipe(map(OrderDate => ({ OrderDate }))),

      // RequestorId
      this.fg_fields
        .get('RequestorId')
        .valueChanges.pipe(map(RequestorId => ({ RequestorId }))),

      // LocationId
      this.fg_fields
        .get('LocationId')
        .valueChanges.pipe(map(LocationId => ({ LocationId }))),

      // ActiveLineItems
      this.fg_fields
        .get('ActiveLineItems')
        .valueChanges.pipe(map(ActiveLineItems => ({ ActiveLineItems }))),

      // Ln01
      this.fg_fields.get('Ln01').valueChanges.pipe(map(Ln01 => ({ Ln01 }))),
      this.fg_fields
        .get('Ln01_Qty')
        .valueChanges.pipe(map(Ln01_Qty => ({ Ln01_Qty }))),
      this.fg_fields
        .get('Ln01_PN')
        .valueChanges.pipe(map(Ln01_PN => ({ Ln01_PN }))),
      this.fg_fields
        .get('Ln01_OrderNumber')
        .valueChanges.pipe(map(Ln01_OrderNumber => ({ Ln01_OrderNumber }))),
      this.fg_fields
        .get('Ln01_OrderStatusId')
        .valueChanges.pipe(map(Ln01_OrderStatusId => ({ Ln01_OrderStatusId }))),
      this.fg_fields
        .get('Ln01_Comments')
        .valueChanges.pipe(map(Ln01_Comments => ({ Ln01_Comments }))),

      // Ln02
      this.fg_fields.get('Ln02').valueChanges.pipe(map(Ln02 => ({ Ln02 }))),
      this.fg_fields
        .get('Ln02_Qty')
        .valueChanges.pipe(map(Ln02_Qty => ({ Ln02_Qty }))),
      this.fg_fields
        .get('Ln02_PN')
        .valueChanges.pipe(map(Ln02_PN => ({ Ln02_PN }))),
      this.fg_fields
        .get('Ln02_OrderNumber')
        .valueChanges.pipe(map(Ln02_OrderNumber => ({ Ln02_OrderNumber }))),
      this.fg_fields
        .get('Ln02_OrderStatusId')
        .valueChanges.pipe(map(Ln02_OrderStatusId => ({ Ln02_OrderStatusId }))),
      this.fg_fields
        .get('Ln02_Comments')
        .valueChanges.pipe(map(Ln02_Comments => ({ Ln02_Comments }))),

      // Ln03
      this.fg_fields.get('Ln03').valueChanges.pipe(map(Ln03 => ({ Ln03 }))),
      this.fg_fields
        .get('Ln03_Qty')
        .valueChanges.pipe(map(Ln03_Qty => ({ Ln03_Qty }))),
      this.fg_fields
        .get('Ln03_PN')
        .valueChanges.pipe(map(Ln03_PN => ({ Ln03_PN }))),
      this.fg_fields
        .get('Ln03_OrderNumber')
        .valueChanges.pipe(map(Ln03_OrderNumber => ({ Ln03_OrderNumber }))),
      this.fg_fields
        .get('Ln03_OrderStatusId')
        .valueChanges.pipe(map(Ln03_OrderStatusId => ({ Ln03_OrderStatusId }))),
      this.fg_fields
        .get('Ln03_Comments')
        .valueChanges.pipe(map(Ln03_Comments => ({ Ln03_Comments }))),

      // Ln04
      this.fg_fields.get('Ln04').valueChanges.pipe(map(Ln04 => ({ Ln04 }))),
      this.fg_fields
        .get('Ln04_Qty')
        .valueChanges.pipe(map(Ln04_Qty => ({ Ln04_Qty }))),
      this.fg_fields
        .get('Ln04_PN')
        .valueChanges.pipe(map(Ln04_PN => ({ Ln04_PN }))),
      this.fg_fields
        .get('Ln04_OrderNumber')
        .valueChanges.pipe(map(Ln04_OrderNumber => ({ Ln04_OrderNumber }))),
      this.fg_fields
        .get('Ln04_OrderStatusId')
        .valueChanges.pipe(map(Ln04_OrderStatusId => ({ Ln04_OrderStatusId }))),
      this.fg_fields
        .get('Ln04_Comments')
        .valueChanges.pipe(map(Ln04_Comments => ({ Ln04_Comments }))),

      // Ln05
      this.fg_fields.get('Ln05').valueChanges.pipe(map(Ln05 => ({ Ln05 }))),
      this.fg_fields
        .get('Ln05_Qty')
        .valueChanges.pipe(map(Ln05_Qty => ({ Ln05_Qty }))),
      this.fg_fields
        .get('Ln05_PN')
        .valueChanges.pipe(map(Ln05_PN => ({ Ln05_PN }))),
      this.fg_fields
        .get('Ln05_OrderNumber')
        .valueChanges.pipe(map(Ln05_OrderNumber => ({ Ln05_OrderNumber }))),
      this.fg_fields
        .get('Ln05_OrderStatusId')
        .valueChanges.pipe(map(Ln05_OrderStatusId => ({ Ln05_OrderStatusId }))),
      this.fg_fields
        .get('Ln05_Comments')
        .valueChanges.pipe(map(Ln05_Comments => ({ Ln05_Comments }))),

      // Ln06
      this.fg_fields.get('Ln06').valueChanges.pipe(map(Ln06 => ({ Ln06 }))),
      this.fg_fields
        .get('Ln06_Qty')
        .valueChanges.pipe(map(Ln06_Qty => ({ Ln06_Qty }))),
      this.fg_fields
        .get('Ln06_PN')
        .valueChanges.pipe(map(Ln06_PN => ({ Ln06_PN }))),
      this.fg_fields
        .get('Ln06_OrderNumber')
        .valueChanges.pipe(map(Ln06_OrderNumber => ({ Ln06_OrderNumber }))),
      this.fg_fields
        .get('Ln06_OrderStatusId')
        .valueChanges.pipe(map(Ln06_OrderStatusId => ({ Ln06_OrderStatusId }))),
      this.fg_fields
        .get('Ln06_Comments')
        .valueChanges.pipe(map(Ln06_Comments => ({ Ln06_Comments }))),

      // Ln07
      this.fg_fields.get('Ln07').valueChanges.pipe(map(Ln07 => ({ Ln07 }))),
      this.fg_fields
        .get('Ln07_Qty')
        .valueChanges.pipe(map(Ln07_Qty => ({ Ln07_Qty }))),
      this.fg_fields
        .get('Ln07_PN')
        .valueChanges.pipe(map(Ln07_PN => ({ Ln07_PN }))),
      this.fg_fields
        .get('Ln07_OrderNumber')
        .valueChanges.pipe(map(Ln07_OrderNumber => ({ Ln07_OrderNumber }))),
      this.fg_fields
        .get('Ln07_OrderStatusId')
        .valueChanges.pipe(map(Ln07_OrderStatusId => ({ Ln07_OrderStatusId }))),
      this.fg_fields
        .get('Ln07_Comments')
        .valueChanges.pipe(map(Ln07_Comments => ({ Ln07_Comments }))),

      // Ln08
      this.fg_fields.get('Ln08').valueChanges.pipe(map(Ln08 => ({ Ln08 }))),
      this.fg_fields
        .get('Ln08_Qty')
        .valueChanges.pipe(map(Ln08_Qty => ({ Ln08_Qty }))),
      this.fg_fields
        .get('Ln08_PN')
        .valueChanges.pipe(map(Ln08_PN => ({ Ln08_PN }))),
      this.fg_fields
        .get('Ln08_OrderNumber')
        .valueChanges.pipe(map(Ln08_OrderNumber => ({ Ln08_OrderNumber }))),
      this.fg_fields
        .get('Ln08_OrderStatusId')
        .valueChanges.pipe(map(Ln08_OrderStatusId => ({ Ln08_OrderStatusId }))),
      this.fg_fields
        .get('Ln08_Comments')
        .valueChanges.pipe(map(Ln08_Comments => ({ Ln08_Comments }))),

      // Ln09
      this.fg_fields.get('Ln09').valueChanges.pipe(map(Ln09 => ({ Ln09 }))),
      this.fg_fields
        .get('Ln09_Qty')
        .valueChanges.pipe(map(Ln09_Qty => ({ Ln09_Qty }))),
      this.fg_fields
        .get('Ln09_PN')
        .valueChanges.pipe(map(Ln09_PN => ({ Ln09_PN }))),
      this.fg_fields
        .get('Ln09_OrderNumber')
        .valueChanges.pipe(map(Ln09_OrderNumber => ({ Ln09_OrderNumber }))),
      this.fg_fields
        .get('Ln09_OrderStatusId')
        .valueChanges.pipe(map(Ln09_OrderStatusId => ({ Ln09_OrderStatusId }))),
      this.fg_fields
        .get('Ln09_Comments')
        .valueChanges.pipe(map(Ln09_Comments => ({ Ln09_Comments }))),

      // Ln10
      this.fg_fields.get('Ln10').valueChanges.pipe(map(Ln10 => ({ Ln10 }))),
      this.fg_fields
        .get('Ln10_Qty')
        .valueChanges.pipe(map(Ln10_Qty => ({ Ln10_Qty }))),
      this.fg_fields
        .get('Ln10_PN')
        .valueChanges.pipe(map(Ln10_PN => ({ Ln10_PN }))),
      this.fg_fields
        .get('Ln10_OrderNumber')
        .valueChanges.pipe(map(Ln10_OrderNumber => ({ Ln10_OrderNumber }))),
      this.fg_fields
        .get('Ln10_OrderStatusId')
        .valueChanges.pipe(map(Ln10_OrderStatusId => ({ Ln10_OrderStatusId }))),
      this.fg_fields
        .get('Ln10_Comments')
        .valueChanges.pipe(map(Ln10_Comments => ({ Ln10_Comments }))),

      // Ln11
      this.fg_fields.get('Ln11').valueChanges.pipe(map(Ln11 => ({ Ln11 }))),
      this.fg_fields
        .get('Ln11_Qty')
        .valueChanges.pipe(map(Ln11_Qty => ({ Ln11_Qty }))),
      this.fg_fields
        .get('Ln11_PN')
        .valueChanges.pipe(map(Ln11_PN => ({ Ln11_PN }))),
      this.fg_fields
        .get('Ln11_OrderNumber')
        .valueChanges.pipe(map(Ln11_OrderNumber => ({ Ln11_OrderNumber }))),
      this.fg_fields
        .get('Ln11_OrderStatusId')
        .valueChanges.pipe(map(Ln11_OrderStatusId => ({ Ln11_OrderStatusId }))),
      this.fg_fields
        .get('Ln11_Comments')
        .valueChanges.pipe(map(Ln11_Comments => ({ Ln11_Comments }))),

      // Ln12
      this.fg_fields.get('Ln12').valueChanges.pipe(map(Ln12 => ({ Ln12 }))),
      this.fg_fields
        .get('Ln12_Qty')
        .valueChanges.pipe(map(Ln12_Qty => ({ Ln12_Qty }))),
      this.fg_fields
        .get('Ln12_PN')
        .valueChanges.pipe(map(Ln12_PN => ({ Ln12_PN }))),
      this.fg_fields
        .get('Ln12_OrderNumber')
        .valueChanges.pipe(map(Ln12_OrderNumber => ({ Ln12_OrderNumber }))),
      this.fg_fields
        .get('Ln12_OrderStatusId')
        .valueChanges.pipe(map(Ln12_OrderStatusId => ({ Ln12_OrderStatusId }))),
      this.fg_fields
        .get('Ln12_Comments')
        .valueChanges.pipe(map(Ln12_Comments => ({ Ln12_Comments }))),

      // LastUpdated
      this.fg_fields
        .get('LastUpdated')
        .valueChanges.pipe(map(LastUpdated => ({ LastUpdated }))),

      // LastUpdatedById
      this.fg_fields
        .get('LastUpdatedById')
        .valueChanges.pipe(map(LastUpdatedById => ({ LastUpdatedById })))
    );

    this.$maybeUnsavedFields = this.fc_changes$
      .pipe(
        scan((acc: OrderItem, curr) => {
          const key = Object.keys(curr).toString();
          if (this.initialFields[key] !== curr[key]) {
            return { ...acc, ...curr };
          } else if (this.initialFields[key] === curr[key]) {
            let rest;
            ({ [key]: key, ...rest } = acc);
            return rest;
          }
        }, {}),
        map((fields: OrderItem | {}) => {
          if (Object.keys(fields).length >= 1) {
            return { ...fields, id: this.initialFields['ID'] };
          } else {
            return fields;
          }
        })
      )
      .subscribe((fields: OrderItem | {}) => {
        console.log(fields);
        this.whenUnsavedFieldsChange.emit(fields);
      });
  }

  ngOnDestroy() {
    this.$maybeUnsavedFields.unsubscribe();
  }
}
