import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// constants
import { ApiPath } from './../../../shared/constants/index';

// service provided in
import { PpeModule } from '../ppe.module';

// rxjs
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: PpeModule
})
export class PpeService {
  constructor(private http: HttpClient) {}

  getPPECategories() {
    const url = `${ApiPath}/web/lists/getbytitle('NgPPECategories')/items`;
    return this.http.get(url).pipe(
      map((response: { value: any[] }) => {
        return response.value;
      })
    );
  }

  getPPEItems() {
    const url = `${ApiPath}/web/lists/getbytitle('NgPPEItems')/items?`;

    const select = `$select=Id,Title,Price,CategoryId,Supplier/Title,Attachments,AttachmentFiles,LocationId`;
    const expand = `&$expand=AttachmentFiles,Supplier`;

    return this.http.get(url + select + expand).pipe(
      map((response: { value: any[] }) => {
        return response.value;
      })
    );
  }
}
