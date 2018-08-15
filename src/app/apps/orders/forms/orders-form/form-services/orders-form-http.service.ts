import { Injectable } from '@angular/core';

// rxjs
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// constants
import { ApiPath } from '../../../../../shared/constants';

// interface
import {
  SpGetListItemResult,
  SpListItemAttachmentFile
} from '../../../../../shared/interface/sp-list-item.model';
import { OrderItem } from './../../../../../shared/interface/orders.model';

// services
import { SharepointService } from '../../../../../shared/services/sharepoint.service';
import { OrdersService } from '../../../services';

@Injectable()
export class OrdersFormHttpService {
  constructor(private sp: SharepointService, private srv: OrdersService) {}

  // returns newly create PeopleItem object
  createOrder(newFields: OrderItem) {
    const fdv$ = this.sp.getFDV();

    return fdv$.pipe(
      switchMap(fdv => {
        const create$ = new sprLib.list({
          name: 'NgOrders',
          ...fdv
        }).create(newFields);
        return from(create$);
      })
    );
  }

  // receives unsavedFields and saves them in list
  // returns object with saved fields or error
  updateItem(updatedFields): Observable<OrderItem> {
    // go ask for form digest value
    const fdv$ = this.sp.getFDV();
    // when get FDV then run HTTP to update list item
    return fdv$.pipe(
      switchMap(fdv => {
        const update$: Promise<any> = new sprLib.list({
          name: 'NgOrders',
          ...fdv
        }).update(updatedFields);
        return from(update$);
      })
    );
  }

  getItemById(ID: number) {
    const url = `${ApiPath}/web/lists/getbytitle('NgOrders')/items(${ID})?`;
    // url += `$select=${this.srv.getSelectFields()}`;
    // url += `&$expand=${this.srv.getExpandFields()}`;
    return from(sprLib.rest({ url: url }));
  }
}
