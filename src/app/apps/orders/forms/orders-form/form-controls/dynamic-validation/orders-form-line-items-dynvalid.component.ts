import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import { FormControl, Validators } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

// validation
import { ValidationService } from './../../../../../../shared/validators/validation.service';

@Component({
  selector: 'app-orders-form-line-item-dynamic-validation',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersFormLineItemDynamicValidationComponent
  implements OnInit, OnDestroy {
  @Input()
  lineItem: string; // e.g. '01'
  @Input()
  title: FormControl;
  @Input()
  qty: FormControl;
  @Input()
  pn: FormControl;
  @Input()
  orderstatusid: FormControl;

  // watch value changes and react
  // $title: Subscription;
  // $qty: Subscription;
  // $pn: Subscription;
  // $orderstatusid: Subscription;

  // default validators
  titleValidators = [Validators.required, Validators.maxLength(255)];
  qtyValidators = [Validators.required, ValidationService.onlyNumbers];
  pnValidators = [Validators.required, Validators.maxLength(70)];
  orderstatusidValidators = [Validators.required];

  constructor() {}

  ngOnInit() {
    console.log('on init line item: ' + this.lineItem);
    this.title.setValidators(this.titleValidators);
    this.qty.setValidators(this.qtyValidators);
    this.pn.setValidators(this.pnValidators);
    this.orderstatusid.setValidators(this.orderstatusidValidators);
  }

  ngOnDestroy() {
    console.log('on destroy line item: ' + this.lineItem);

    this.title.clearValidators();
    this.title.setErrors(null);

    this.qty.clearValidators();
    this.qty.setErrors(null);

    this.pn.clearValidators();
    this.pn.setErrors(null);

    this.orderstatusid.clearValidators();
    this.orderstatusid.setErrors(null);
  }
}
