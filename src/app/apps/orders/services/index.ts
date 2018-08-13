import { OrdersService } from './orders.service';
import { OrdersFetchService } from './orders-fetch.service';

export const services: any[] = [OrdersService, OrdersFetchService];

export * from './orders.service';
export * from './orders-fetch.service';
