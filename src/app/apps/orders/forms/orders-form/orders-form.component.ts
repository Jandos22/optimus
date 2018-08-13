import { OrderStatus } from './../../../../shared/interface/orders.model';
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectorRef
} from '@angular/core';

// constants
import {
  PathSlbSp,
  WirelinePath,
  PathOptimus
} from '../../../../shared/constants';

import { FormGroup } from '@angular/forms';

// rxjs
import { Subscription, Observable, Subject } from 'rxjs';

import { map, tap, startWith } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromOrders from '../../store';

import * as _ from 'lodash';

// material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// form services
import { OrdersFormInitService } from './form-services/orders-form-init.service';
import { OrdersFormHttpService } from './form-services/orders-form-http.service';

// interfaces
import { OrderItem } from '../../../../shared/interface/orders.model';
import { FormMode } from '../../../../shared/interface/form.model';
import { SpListItemAttachmentFiles } from '../../../../shared/interface/sp-list-item.model';
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-orders-form',
  styleUrls: ['orders-form.component.scss'],
  templateUrl: './orders-form.component.html',
  providers: [OrdersFormHttpService, OrdersFormInitService]
})
export class OrdersFormComponent implements OnInit, OnDestroy {
  // form shall have only two form groups
  // which are initialized immediately in class constructor
  fg_fields: FormGroup;

  accessLevel$: Observable<number>;

  $locationAssignedId: Subscription;
  locationAssignedId: number;

  // form title
  Title: string;

  // get self optimus account
  selfUser$: Observable<PeopleItem>;

  // selectables
  locations$: Observable<LocationEnt[]>;
  orderStatuses$: Observable<OrderStatus[]>;

  // Form Mode is Subject
  $mode: Subject<FormMode>;

  $activeLineItems: Subscription;
  activeLineItems: string[];

  removeLineItem: any;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_orders: Store<fromOrders.OrdersState>,
    private formInitService: OrdersFormInitService,
    public formRef: MatDialogRef<OrdersFormComponent>,
    private cd: ChangeDetectorRef,
    // private formSizeService: PeopleFormSizeService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: FormMode; item?: OrderItem }
  ) {}

  ngOnInit() {
    this.$mode = new Subject<FormMode>();

    this.setupSubscriptions();
    this.setupObservables();

    this.$mode.next(this.data.mode);

    // this.setupFormObservables();
  }

  setupSubscriptions() {
    // all subscriptions start with $ prefix
    // this helps quickly check if all been unsubscribed

    // $$$ when Form Mode changes initialize form groups
    this.$mode.subscribe(mode => {
      console.log('mode changed to: ' + mode);
      this.data.mode = mode;
      console.log('data item used:');
      console.log(this.data.item);

      this.createFormGroups(mode, this.data.item, this.locationAssignedId);
    });

    // get user's location assigned id
    this.$locationAssignedId = this.store_root
      .pipe(select(fromRoot.getUserLocationAssignedId))
      .subscribe(locationId => (this.locationAssignedId = locationId));
  }

  setupObservables() {
    // list of component life long observables
    // all observables end with $ suffix

    // get self user item to use in project reporters selection
    this.selfUser$ = this.store_root.pipe(select(fromRoot.getUserOptimus));

    // get and observe user's access level
    this.accessLevel$ = this.store_root.pipe(
      select(fromRoot.getUserAccessLevel)
    );

    // get selectable locations
    this.locations$ = this.store_root.select(fromRoot.selectAllLocations);

    this.orderStatuses$ = this.store_orders
      .select(fromOrders.selectAllOrderStatuses)
      .pipe(tap(v => console.log(v)));
  }

  createFormGroups(m: FormMode, it: OrderItem, lo: number) {
    // remove old form watchers if any
    this.removeFormWatchers();

    // create 1 form group
    this.fg_fields = this.formInitService.create_FormGroup_Fields(m, it, lo);

    console.log('created 1 form group:');
    console.log(this.fg_fields);

    console.log('refresh watchers of form group fields');
    this.setupFormWatchers();
  }

  switchFormMode(mode: FormMode) {
    this.$mode.next(mode);
  }

  setupFormWatchers() {
    // this regulates how many job summary sections to show
    this.$activeLineItems = this.fg_fields.controls[
      'ActiveLineItems'
    ].valueChanges
      .pipe(startWith(this.fg_fields.controls['ActiveLineItems'].value))
      .subscribe(lineItems => {
        this.activeLineItems = _.times(lineItems, (i: number) => {
          const ln = (i + 1).toString();
          return ln.toString().length === 1 ? '0' + ln : ln;
        });
        this.cd.detectChanges();
        console.log('line items count changed to: ' + this.activeLineItems);
      });
  }

  removeFormWatchers() {
    if (this.$activeLineItems) {
      this.$activeLineItems.unsubscribe();
    }
  }

  // triggered after saving fields
  updateDataItem(updatedFields: OrderItem) {
    console.log('updating data item:');
    console.log(updatedFields);

    this.data.item = { ...this.data.item, ...updatedFields };
  }

  onSelectRequestor(selected: number[]) {
    this.fg_fields.get('RequestorId').patchValue(selected[0]);
  }

  onRemoveLineItem(ln: string) {
    if (this.activeLineItems.length > 1) {
      this.removeLineItem = {
        curr: ln,
        total: this.activeLineItems.length
      };
      this.cd.detectChanges();
    }
  }

  closeForm($event) {
    this.formRef.close($event);
  }

  // unsubscribe from Subscription when component is destroyed
  ngOnDestroy() {
    this.$mode.unsubscribe();
    this.$locationAssignedId.unsubscribe();
  }
}
