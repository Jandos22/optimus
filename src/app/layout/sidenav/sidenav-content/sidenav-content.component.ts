import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';

import * as _ from 'lodash';

// interfaces
import { LocationEnt } from './../../../shared/interface/locations.model';
import { AppItem } from '../../../shared/interface/applications.model';

@Component({
  selector: 'app-sidenav-content',
  styleUrls: ['sidenav-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-nav-list style="margin: -8px 16px 0 16px;">
        <app-sidenav-content-app *ngFor="let app of appsMap | appsFilter: showHiddenApps"
            class="sidenav-app-component"
            mat-list-item
            [app]="app">
        </app-sidenav-content-app>
    </mat-nav-list>
    `
})
export class SidenavContentComponent implements OnChanges {
  @Input() myLocation: LocationEnt;
  @Input() apps: AppItem[];
  @Input() showHiddenApps: boolean;

  appsMap: AppItem[];

  constructor() {}

  mapApplications(appsAll: AppItem[], myLocation: LocationEnt) {
    if (myLocation) {
      const appsInUse = _.reduce(
        myLocation.ApplicationsInUse,
        function(acc: Object, app: AppItem) {
          return { ...acc, [app.ID]: app };
        },
        {}
      );
      this.appsMap = _.map(appsAll, function(app: AppItem) {
        if (_.has(appsInUse, app.ID)) {
          return { ...app, Visible: true };
        } else {
          return { ...app, Visible: false };
        }
      });
    } else {
      console.log('myLocation: ');
      console.log(myLocation);
      this.appsMap = [];
    }
  }

  // recalculate some values only when input references change
  // detection onPush is good for app performance
  ngOnChanges(changes: SimpleChanges) {
    const myLocation: SimpleChange = changes.myLocation;
    const apps: SimpleChange = changes.apps;
    const showHiddenApps: SimpleChange = changes.showHiddenApps;

    if (myLocation && apps) {
      console.log(apps);
      console.log(myLocation);
      console.log(showHiddenApps);
      this.mapApplications(apps.currentValue, myLocation.currentValue);
    }

    if (showHiddenApps) {
      this.mapApplications(this.apps, this.myLocation);
    }
  }

  getLocationAssigned() {}
}
