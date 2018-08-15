import { Injectable } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import * as addDays from 'date-fns/add_days';
import * as startOfDay from 'date-fns/start_of_day';

import * as _ from 'lodash';

// services
import { ValidationService } from './../../../../../shared/validators/validation.service';

// interfaces
import { FormMode } from '../../../../../shared/interface/form.model';
import { OrderItem } from '../../../../../shared/interface/orders.model';

// constants
import { ApiPath, PathSlbSp } from '../../../../../shared/constants';

@Injectable()
export class OrdersFormInitService {
  constructor(private fb: FormBuilder) {}

  // lo = location assigned, me = user's optimus id
  create_FormGroup_Fields(mo: FormMode, it: OrderItem, lo: number) {
    // validators
    const val_req = Validators.required;
    const val_ml140 = Validators.maxLength(140);

    return this.fb.group({
      OrderName: [this.getValue(mo, it, 'OrderName'), [val_req, val_ml140]],
      OrderDate: [this.getDate(mo, it), [val_req]],
      RequestorId: [this.getValue(mo, it, 'RequestorId'), [val_req]],
      LocationId: [this.getLocation(mo, it, lo), [val_req]],
      ActiveLineItems: [this.getLineItemsCount(mo, it), [val_req]],
      ...this.getLineItems(mo, it, 12),
      LastUpdated: [this.getValue(mo, it, 'LastUpdated')],
      LastUpdatedById: [this.getValue(mo, it, 'LastUpdatedById')],
      LastUpdatedFlag: [this.getValue(mo, it, 'LastUpdatedFlag')]
    });
  }

  getValue(mode: FormMode, item: OrderItem, field: string) {
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value: item[field], disabled: true };
      case 'edit':
        return { value: item[field], disabled: false };
    }
  }

  getDate(mode: FormMode, item: OrderItem) {
    switch (mode) {
      case 'new':
        return { value: startOfDay(new Date()), disabled: false };
      case 'view':
        return { value: new Date(item.OrderDate), disabled: true };
      case 'edit':
        return { value: new Date(item.OrderDate), disabled: false };
    }
  }

  getRequestor(mode: FormMode, item: OrderItem, myId: number) {
    switch (mode) {
      case 'new':
        return myId;
      case 'view':
        return { value: item['RequestorId'], disabled: true };
      case 'edit':
        return { value: item['RequestorId'], disabled: false };
    }
  }

  getLocation(mode: FormMode, item: OrderItem, locationId: number) {
    switch (mode) {
      case 'new':
        return locationId; // Default location is locationAssignedId
      case 'view':
        return item.LocationId;
      case 'edit':
        return item.LocationId;
    }
  }

  getLineItemsCount(mode: FormMode, item: OrderItem) {
    switch (mode) {
      case 'new':
        return 1;
      case 'view':
        return { value: item['ActiveLineItems'], disabled: true };
      case 'edit':
        return { value: item['ActiveLineItems'], disabled: false };
    }
  }

  getLineItems(mo: FormMode, it: OrderItem, num: number) {
    const req = Validators.required;
    const max70 = [Validators.maxLength(70)];
    const max140 = [Validators.maxLength(140)];
    const max255 = [Validators.maxLength(255)];

    const lineItems: any[] = _.times(num, (i: number) => {
      const n = i + 1;
      const s = n.toString().length === 1 ? '0' + n : n;
      const field = `Ln${s}_Title`;
      return [field, [this.getValue(mo, it, field), max255]];
    });

    const lineQty: any[] = _.times(num, (i: number) => {
      const n = i + 1;
      const s = n.toString().length === 1 ? '0' + n : n;
      const field = `Ln${s}_Qty`;
      return [
        [field],
        [this.getValue(mo, it, field), ValidationService.onlyNumbers]
      ];
    });

    const linePNs: any[] = _.times(num, (i: number) => {
      const n = i + 1;
      const s = n.toString().length === 1 ? '0' + n : n;
      const field = `Ln${s}_PN`;
      return [field, [this.getValue(mo, it, field), max70]];
    });

    const lineOrderNumbers: any[] = _.times(num, (i: number) => {
      const n = i + 1;
      const s = n.toString().length === 1 ? '0' + n : n;
      const field = `Ln${s}_OrderNumber`;
      return [field, [this.getValue(mo, it, field), max70]];
    });

    const lineOrderStatuses: any[] = _.times(num, (i: number) => {
      const n = i + 1;
      const s = n.toString().length === 1 ? '0' + n : n;
      const field = `Ln${s}_OrderStatusId`;
      return [field, [this.getValue(mo, it, field)]];
    });

    const lineComments: any[] = _.times(num, (i: number) => {
      const n = i + 1;
      const s = n.toString().length === 1 ? '0' + n : n;
      const field = `Ln${s}_Comments`;
      return [field, [this.getValue(mo, it, field)]];
    });

    const mergedLineItems = _.fromPairs(lineItems);
    const mergedLineQty = _.fromPairs(lineQty);
    const mergedLinePNs = _.fromPairs(linePNs);
    const mergedLineOrderNumbers = _.fromPairs(lineOrderNumbers);
    const mergedLineOrderStatuses = _.fromPairs(lineOrderStatuses);
    const mergedLineComments = _.fromPairs(lineComments);

    return {
      ...mergedLineItems,
      ...mergedLineQty,
      ...mergedLinePNs,
      ...mergedLineOrderNumbers,
      ...mergedLineOrderStatuses,
      ...mergedLineComments
    };
  }
}
