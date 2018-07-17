import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';

import * as _ from 'lodash';

// interfaces
import { LocationEnt } from '../../../shared/interface/locations.model';
import { AppItem } from '../../../shared/interface/applications.model';

@Component({
  selector: 'app-sidenav-content',
  styleUrls: ['sidenav-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-nav-list style="margin: -8px 16px 0 16px;">
        <app-sidenav-content-app *ngFor="let app of appsMap | appsFilter: showHiddenApps"
            mat-list-item class="sidenav-app-component"
            [app]="app" [myLocation]="myLocation"
            (onSidenavClick)="onSidenavClick.emit()"
            fxLayout="row nowrap" fxLayoutAling="space-between center">
        </app-sidenav-content-app>
    </mat-nav-list>
    `
})
export class SidenavContentComponent implements OnChanges {
  @Input() myLocation: LocationEnt;
  @Input() apps: AppItem[];
  @Input() showHiddenApps: boolean;

  @Output() onSidenavClick = new EventEmitter<any>();

  appsMap: AppItem[];

  constructor() {}

  mapApplications(appsAll: AppItem[], myLocation: LocationEnt) {
    // check if my location is present
    if (myLocation) {
      // if my location is available
      // then create object of apps in use
      // whose property name equals to NgApps list id
      const appsInUse = _.reduce(
        myLocation.ApplicationsInUse,
        function(acc: Object, app: AppItem) {
          return { ...acc, [app.ID]: app };
        },
        {}
      );

      // go through all apps and add Visible property
      // which will be true if found in apps in use
      this.appsMap = _.map(appsAll, function(app: AppItem) {
        if (_.has(appsInUse, app.ID)) {
          return { ...app, Visible: true };
        } else {
          return { ...app, Visible: false };
        }
      });
    } else {
      console.log('myLocation not found: ');
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
      // console.log(apps);
      // console.log(myLocation);
      // console.log(showHiddenApps);
      this.mapApplications(apps.currentValue, myLocation.currentValue);
    }

    if (showHiddenApps) {
      this.mapApplications(this.apps, this.myLocation);
    }
  }
}
