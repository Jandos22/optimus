import { PathSlbSp } from '../constants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { Observable, of, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ApiPath, WirelinePath, ProxyPath } from '../constants';

// data models
import { FDV } from '../interface/form-digest-value.model';
import { CurrentUser } from './../interface/user.model';

// services
import { SharepointService } from './sharepoint.service';
import { PeopleItem } from '../interface/people.model';

// import { sprLib } from '../../../typings';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getLoggedInUser() {
    return new sprLib.user().info();
  }

  checkLoggedInUserRegistered(alias) {
    let url = `${ApiPath}/web/lists/getbytitle('NgPeople')/items?`;
    url += `$select=${this.getSelectFields()}`;
    url += `&$expand=${this.getExpandsFields()}`;
    url += `&$filter=Alias eq '${alias}'`;
    return from(sprLib.rest({ url }));
  }

  listitem(list) {
    return (
      'SP.Data.' + list.charAt(0).toUpperCase() + list.slice(1) + 'ListItem'
    );
  }

  prepCurrentUserObject(user: CurrentUser) {
    console.log('prepCurrentUserObject(user)');
    console.log(user);

    let loginName = user.LoginName;
    let spId = user.Id;

    // used only in development mode, on my Mac
    if (
      loginName === 'i:0i.t|00000003-0000-0ff1-ce00-000000000000|app@sharepoint'
    ) {
      // loginName = 'dismagulov@slb.com'; // FE
      // spId = 9;
      // loginName = 'zombayev@slb.com'; // FE
      // spId = 167;
      // loginName = 'azhussipov@slb.com'; // FE
      // spId = 6;
      loginName = 'cmarcotte@slb.com'; // PSDM
      spId = 209;
      // loginName = 'rmiller36@slb.com'; // OU PSDM
      // spId = 16;
      // loginName = 'myergazin@slb.com'; // OU PSDM
      // spId = 210;
      // loginName = 'knigmetullin@slb.com'; // OU PSDM
      // spId = 226;
      // loginName = 'rayat@slb.com'; // FDE Manager
      // spId = 250;
      // loginName = 'kbatyrkhanov@slb.com'; // Sales Engineer
      // spId = 261;
      // loginName = 'amukumova@slb.com';
      // spId = 233;
    }

    const email = loginName.replace('i:0#.f|membership|', '');
    const username = email.replace('@slb.com', '');
    const initials = username.substring(0, 2).toUpperCase();

    return {
      username,
      email,
      initials,
      spId
    };
  }

  getSelectFields() {
    return [
      'Id',
      'Name',
      'Surname',
      'Fullname',
      'Shortname',
      'Alias',
      'Attachments',
      'AttachmentFiles',
      'LocationAssignedId',
      'LocationAssigned/Title',
      'LocationsOfInterestId',
      'LocationsOfInterest/Title',
      'PositionId',
      'Position/Title',
      'Position/AccessLevel',
      'Roles',
      'Roles/Id',
      'Roles/Title',
      'DirectReports',
      'DirectReportsId',
      'DirectReports/Id',
      'DirectReports/Alias'
    ].toString();
  }

  getExpandsFields() {
    return [
      'AttachmentFiles',
      'LocationAssigned',
      'LocationsOfInterest',
      'Position',
      'Roles',
      'DirectReports'
    ].toString();
  }

  private getFDV() {
    const url = ApiPath + 'contextinfo';
    const headers = new HttpHeaders().set(
      'accept',
      'application/json;odata=verbose'
    );
    return this.http.post(url, { headers });
  }
}
