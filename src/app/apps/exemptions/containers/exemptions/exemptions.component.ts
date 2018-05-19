import { Component, OnInit } from '@angular/core';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store';

@Component({
  selector: 'app-exemptions',
  template: `
    <h1>Exemptions</h1>
  `,
  styleUrls: ['./exemptions.component.scss']
})
export class ExemptionsComponent implements OnInit {
  // title in header
  appName = 'Exemptions';

  constructor(private rootStore: Store<fromRoot.RootState>) {}

  ngOnInit() {
    // update html page title
    this.rootStore.dispatch(new fromRoot.ChangeAppName(this.appName));
  }
}
