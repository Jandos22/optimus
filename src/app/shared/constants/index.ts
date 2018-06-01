import { environment } from '../../../environments/environment';

// ApiPath constant is crucial as all HTTP calls are using it
// different prefixes are selected according to environment mode
export const ApiPath = environment.production
  ? 'https://slb001.sharepoint.com/sites/wireline/_api/'
  : '_api/';

export const PathSlbSp = 'https://slb001.sharepoint.com/';
export const WirelinePath = 'https://slb001.sharepoint.com/sites/wireline';
export const ProxyPath = 'http://localhost:8080';
export const PathOptimus =
  'https://slb001.sharepoint.com/sites/wireline/optimus';
