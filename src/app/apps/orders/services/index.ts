import { OrdersService } from './orders.service';
import { OrdersFetchService } from './orders-fetch.service';
import { OrdersUrlParamsService } from './orders-url-params.service';

export const services: any[] = [
  OrdersService,
  OrdersFetchService,
  OrdersUrlParamsService
];

export * from './orders.service';
export * from './orders-fetch.service';
export * from './orders-url-params.service';
