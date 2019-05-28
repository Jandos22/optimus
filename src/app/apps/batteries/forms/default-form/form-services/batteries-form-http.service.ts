import { Injectable } from "@angular/core";

// rxjs
import { Observable, from } from "rxjs";
import { switchMap } from "rxjs/operators";

// constants
import { ApiPath } from "../../../../../shared/constants";

// interface
import { BatteryItem } from "../../../../../shared/interface/batteries.model";

// services
import { SharepointService } from "../../../../../shared/services/sharepoint.service";
import { BatteriesService } from "../../../services";

@Injectable()
export class BatteriesFormHttpService {
  constructor(private sp: SharepointService, private srv: BatteriesService) {}

  createItem(newFields: BatteryItem) {
    const fdv$ = this.sp.getFDV();

    return fdv$.pipe(
      switchMap(fdv => {
        const create$ = new sprLib.list({
          name: "NgBatteries",
          ...fdv
        }).create(newFields);
        return from(create$);
      })
    );
  }

  // receives unsavedFields and saves them in list
  // returns object with saved fields or error
  updateItem(updatedFields: Object): Observable<BatteryItem> {
    // go ask for form digest value
    const fdv$ = this.sp.getFDV();
    // when get FDV then run HTTP to update list item
    return fdv$.pipe(
      switchMap(fdv => {
        const update$: Promise<any> = new sprLib.list({
          name: "NgBatteries",
          ...fdv
        }).update(updatedFields);
        return from(update$);
      })
    );
  }

  getItemById(ID: number) {
    let url = `${ApiPath}/web/lists/getbytitle('NgBatteries')/items(${ID})?`;
    url += `$select=${this.srv.getSelectFields()}`;
    url += `&$expand=${this.srv.getExpandFields()}`;
    return from(sprLib.rest({ url: url }));
  }
}
