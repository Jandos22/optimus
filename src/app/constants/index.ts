import { environment } from './../../environments/environment';

export const ApiPath = environment.production
  ? 'https://slb001.sharepoint.com/sites/wireline/_api/'
  : '_api/';

// export const ApiPath = 'https://slb001.sharepoint.com/sites/wireline/_api/';
// export const ApiPath = '_api/';

export const PathSlbSp = 'https://slb001.sharepoint.com/';
export const WirelinePath = 'https://slb001.sharepoint.com/sites/wireline';
export const ProxyPath = 'http://localhost:8080';
export const PathOptimus =
  'https://slb001.sharepoint.com/sites/wireline/optimus';
