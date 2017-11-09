import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppService {

  // apiPath = 'https://slb001.sharepoint.com/sites/wireline/_api/';
  apiPath = '';

  // Service Functions
    // Receive and Send Application Name
    // Emit events like MenuButtonClicked, SidenavClicked

  // Observable string sources
  private appNameChangedSource = new Subject<string>();
  private menuButtonClickedSource = new Subject<string>();
  private sidenavClickedSource = new Subject<string>();

  // Observable string streams
  appNameChanged$ = this.appNameChangedSource.asObservable();
  menuButtonClicked$ = this.menuButtonClickedSource.asObservable();
  sidenavClicked$ = this.sidenavClickedSource.asObservable();

  // Service message commands
  changeAppName(appName: string) {
    this.appNameChangedSource.next(appName);
  }

  onMenuButtonClicked() {
    this.menuButtonClickedSource.next();
  }

  onSidenavClicked() {
    this.sidenavClickedSource.next();
  }

  getApiPath() {
    return this.apiPath;
  }

  constructor() { }

}
