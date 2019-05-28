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
    <div class="sidenav-inner-container" fxLayout="row wrap">

      <app-location
        class="app-location"
        [id]="myLocation.Id">
      </app-location>

      <!-- apps list version 2 -->
      <div class="app-list-container" fxLayout="row wrap" fxLayoutAlign="start start">
        <div class="applications">Applications</div>
        <app-sidenav-content-app-v2 *ngFor="let app of appsMap | appsFilter: showHiddenApps"
          class="sidenav-content-app-v2"
          [app]="app" (onSidenavClick)="onSidenavClick.emit()"
          fxLayout="row nowrap" fxLayoutAling="space-between center">
        </app-sidenav-content-app-v2>

        <!-- coming soon 
        <app-sidenav-content-app-v2
          matTooltip="coming soon"
          matTooltipClass="mytooltip large-text"
          class="sidenav-content-app-v2 coming-soon"
            [app]="{
              Title: 'SET 2019',
              RouterLink: 'set2019',
              AppPositionNumber: '99',
              Visible: true
            }">
        </app-sidenav-content-app-v2>
        -->

      </div>

      <app-location-links
        *ngIf="linksPresent"
        class="app-location-links"
        [location]="myLocation">
      </app-location-links>

    </div>
    `
})
export class SidenavContentComponent implements OnChanges {
  @Input()
  myLocation: LocationEnt;

  @Input()
  apps: AppItem[];

  @Input()
  showHiddenApps: boolean;

  @Output()
  onSidenavClick = new EventEmitter<any>();

  appsMap: AppItem[];

  linksPresent: boolean;

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
      this.checkLinksPresent(myLocation.currentValue);
    }

    if (showHiddenApps) {
      this.mapApplications(this.apps, this.myLocation);
    }
  }

  checkLinksPresent(location: LocationEnt) {
    const link1 = location.Link1 && location.Link1.length ? true : false;

    const link2 = location.Link2 && location.Link2.length ? true : false;

    const link3 = location.Link3 && location.Link3.length ? true : false;

    const link4 = location.Link4 && location.Link4.length ? true : false;

    if (link1 || link2 || link3 || link4) {
      this.linksPresent = true;
    } else {
      this.linksPresent = false;
    }
  }
}
