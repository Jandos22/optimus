import { SpListItem } from './sp-list-item.model';
import { PeopleItem } from './people.model';
import { LocationEnt } from './locations.model';

export interface OrderItem extends SpListItem {
  id?: number;
  // order title should describe for what order is placed
  OrderName?: string;
  // order date is needed to show orders in chronological order
  // as well as can give an idea on how much time it takes between
  // order creation and when order received
  OrderDate?: Date;
  // requestor can be only one, also treated as order's person in charge
  Requestor?: PeopleItem;
  RequestorId?: number;
  // ordering location
  Location?: LocationEnt;
  LocationId?: number;
  // order line items
  // maximum 12
  ActiveLineItems?: number;
  // #1
  Ln01_Title?: string;
  Ln01_Qty?: number;
  Ln01_PN?: string;
  Ln01_OrderNumber?: number;
  Ln01_OrderStatus?: OrderStatus;
  Ln01_OrderStatusId?: number;
  Ln01_Comments?: string;
  // #2
  Ln02_Title?: string;
  Ln02_Qty?: number;
  Ln02_PN?: string;
  Ln02_OrderNumber?: number;
  Ln02l_OrderStatus?: OrderStatus;
  Ln02_OrderStatusId?: number;
  Ln02_Comments?: string;
  // #3
  Ln03_Title?: string;
  Ln03_Qty?: number;
  Ln03_PN?: string;
  Ln03_OrderNumber?: number;
  Ln03_OrderStatus?: OrderStatus;
  Ln03_OrderStatusId?: number;
  Ln03_Comments?: string;
  // #4
  Ln04_Title?: string;
  Ln04_Qty?: number;
  Ln04_PN?: string;
  Ln04_OrderNumber?: number;
  Ln04_OrderStatus?: OrderStatus;
  Ln04_OrderStatusId?: number;
  Ln04_Comments?: string;
  // #5
  Ln05_Title?: string;
  Ln05_Qty?: number;
  Ln05_PN?: string;
  Ln05_OrderNumber?: number;
  Ln05_OrderStatus?: OrderStatus;
  Ln05_OrderStatusId?: number;
  Ln05_Comments?: string;
  // #6
  Ln06_Title?: string;
  Ln06_Qty?: number;
  Ln06_PN?: string;
  Ln06_OrderNumber?: number;
  Ln06_OrderStatus?: OrderStatus;
  Ln06_OrderStatusId?: number;
  Ln06_Comments?: string;
  // #7
  Ln07_Title?: string;
  Ln07_Qty?: number;
  Ln07_PN?: string;
  Ln07_OrderNumber?: number;
  Ln07_OrderStatus?: OrderStatus;
  Ln07_OrderStatusId?: number;
  Ln07_Comments?: string;
  // #8
  Ln08_Title?: string;
  Ln08_Qty?: number;
  Ln08_PN?: string;
  Ln08_OrderNumber?: number;
  Ln08_OrderStatus?: OrderStatus;
  Ln08_OrderStatusId?: number;
  Ln08_Comments?: string;
  // #9
  Ln09_Title?: string;
  Ln09_Qty?: number;
  Ln09_PN?: string;
  Ln09_OrderNumber?: number;
  Ln09_OrderStatus?: OrderStatus;
  Ln09_OrderStatusId?: number;
  Ln09_Comments?: string;
  // #10
  Ln10_Title?: string;
  Ln10_Qty?: number;
  Ln10_PN?: string;
  Ln10_OrderNumber?: number;
  Ln10_OrderStatus?: OrderStatus;
  Ln10_OrderStatusId?: number;
  Ln10_Comments?: string;
  // #11
  Ln11_Title?: string;
  Ln11_Qty?: number;
  Ln11_PN?: string;
  Ln11_OrderNumber?: number;
  Ln11_OrderStatus?: OrderStatus;
  Ln11_OrderStatusId?: number;
  Ln11_Comments?: string;
  // #12
  Ln12_Title?: string;
  Ln12_Qty?: number;
  Ln12_PN?: string;
  Ln12_OrderNumber?: number;
  Ln12_OrderStatus?: OrderStatus;
  Ln12_OrderStatusId?: number;
  Ln12_Comments?: string;
  // update history is needed
  // to show that order was checked by someone
  LastUpdated?: Date;
  LastUpdatedBy?: PeopleItem;
  LastUpdatedById?: number;
  LastUpdatedFlag?: boolean;
}

export interface OrdersSearchParams {
  text?: string;
  locations?: number[];
  top?: number;
  afterDate?: Date;
  beforeDate?: Date;
  orderName?: string;
  orderNumber?: string;
  orderStatus?: number;
  lastUpdate?: number; // zero = old, one = recent
  partNumber?: string;
  requestors?: number[];
}

export interface OrderStatus extends SpListItem {
  Title: string;
  PositionInList: number;
}

export interface OrderLineItem {
  line?: string;
  title?: string;
  qty?: number;
  pn?: string;
  orderNumber?: string;
  orderStatusId?: number;
  orderStatus?: OrderStatus;
  comments?: string;
}
