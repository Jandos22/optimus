import { pairwise, startWith } from 'rxjs/operators';
import { OrderStatus } from './../../../../../../shared/interface/orders.model';
import {
  Component,
  Input,
  //   OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
  //   ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// interface
import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-orders-form-line-item',
  styleUrls: ['orders-form-line-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lineitem-inner-container" fxLayout="row nowrap" fxLayoutAlign="start stretch"
        [ngClass]="{
            'order-placed': (fg_fields.controls['Ln'+lineItem+'_OrderStatusId'].value === 1),
            'pending-approval': (fg_fields.controls['Ln'+lineItem+'_OrderStatusId'].value === 2),
            'fmt-confirmed': (fg_fields.controls['Ln'+lineItem+'_OrderStatusId'].value === 3),
            'po-created': (fg_fields.controls['Ln'+lineItem+'_OrderStatusId'].value === 4),
            'waiting-gl': (fg_fields.controls['Ln'+lineItem+'_OrderStatusId'].value === 5),
            'gl-released': (fg_fields.controls['Ln'+lineItem+'_OrderStatusId'].value === 6),
            'customs-clearance': (fg_fields.controls['Ln'+lineItem+'_OrderStatusId'].value === 7),
            'received': (fg_fields.controls['Ln'+lineItem+'_OrderStatusId'].value === 8),
            'cancelled': (fg_fields.controls['Ln'+lineItem+'_OrderStatusId'].value === 9)
        }">
        <div fxFlex="40px" class="index">
            {{ lineItem }}
        </div>

        <div class="main" fxLayout="row wrap">

            <app-orders-form-ln-part-number
                class="control part-number" fxLayout="row nowrap"
                [fg_fields]="fg_fields" [mode]="mode" [fieldName]="'Ln'+lineItem+'_PN'">
            </app-orders-form-ln-part-number>

            <app-orders-form-ln-quantity
                class="control quantity" fxLayout="row nowrap"
                [fg_fields]="fg_fields" [mode]="mode" [fieldName]="'Ln'+lineItem+'_Qty'">
            </app-orders-form-ln-quantity>

            <app-orders-form-ln-title
                class="control title" fxLayout="row nowrap"
                [fg_fields]="fg_fields" [mode]="mode" [fieldName]="'Ln'+lineItem+'_Title'">
            </app-orders-form-ln-title>

            <app-orders-form-ln-order-number
                class="control order-number" fxLayout="row nowrap"
                [fg_fields]="fg_fields" [mode]="mode" [fieldName]="'Ln'+lineItem+'_OrderNumber'">
            </app-orders-form-ln-order-number>

            <app-orders-form-ln-order-status
                class="control order-status" fxLayout="row nowrap"
                [fg_fields]="fg_fields" [mode]="mode" [fieldName]="'Ln'+lineItem+'_OrderStatusId'"
                [orderStatuses]="orderStatuses">
            </app-orders-form-ln-order-status>

            <app-orders-form-ln-comments
                class="comments" fxLayout="row nowrap"
                [fg_fields]="fg_fields" [mode]="mode" [fieldName]="'Ln'+lineItem+'_Comments'">
            </app-orders-form-ln-comments>

            <div class="btn-remove" matTooltip='Remove Line Item' (click)="onRemoveLineItem.emit(lineItem)"
                *ngIf="mode !== 'view' && (fg_fields.controls['ActiveLineItems'].value > 1)">
                <fa-icon [icon]="['fas', 'times']"></fa-icon>
            </div>

        </div>

    </div>

    <!-- Hidden / Used for logic operations -->
    <app-orders-form-line-item-dynamic-validation
      [lineItem]="lineItem"
      [title]="fg_fields.controls['Ln'+lineItem+'_Title']"
      [qty]="fg_fields.controls['Ln'+lineItem+'_Qty']"
      [pn]="fg_fields.controls['Ln'+lineItem+'_PN']"
      [orderstatusid]="fg_fields.controls['Ln'+lineItem+'_OrderStatusId']">
    </app-orders-form-line-item-dynamic-validation>
    `
})
export class OrdersFormLineItemComponent {
  @Input()
  fg_fields: FormGroup;
  @Input()
  mode: FormMode;
  @Input()
  lineItem: string;
  @Input()
  orderStatuses: OrderStatus[];

  @Output()
  onRemoveLineItem = new EventEmitter<string>();

  constructor() {}
}
