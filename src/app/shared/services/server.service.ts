import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

import { AppService } from './app.service';

@Injectable()
export class ServerService {

  constructor(private http: HttpClient,
              private appSvc: AppService) { }

  getListItems(listName: string) {
    const apiPath = this.appSvc.getApiPath();
    const url = encodeURI(apiPath + '_api/web/lists/GetByTitle(\'' + listName + '\')/Items');
    console.log(listName + ', ' + url);
    this.http.get(url, {
      headers: new HttpHeaders().set('Accept', 'application/json; odata=verbose')
    }).subscribe(data => {
      console.log(data);
    });
  }

}

