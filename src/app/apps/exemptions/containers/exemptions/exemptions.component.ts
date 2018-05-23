import { Component, OnInit } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// ngrx
import { Store, select } from '@ngrx/store';

// state
import * as fromRoot from '../../../../store';
import * as fromFeature from '../../store';

import * as fromExemptionsActions from '../../store/actions/exemptions.actions';

@Component({
  selector: 'app-exemptions',
  template: `
    <app-exemptions-groups [groups]="groups"></app-exemptions-groups>
  `,
  styleUrls: ['./exemptions.component.scss']
})
export class ExemptionsComponent implements OnInit {
  // title in header
  appName = 'Exemptions';
  groups: Observable<any>;

  constructor(
    private rootStore: Store<fromRoot.RootState>,
    private featureStore: Store<fromFeature.ExemptionsState>
  ) {}

  ngOnInit() {
    // update html page title
    this.rootStore.dispatch(new fromRoot.ChangeAppName(this.appName));
    this.groups = this.featureStore.pipe(select(fromFeature.getExemptionsList));

    // when component starts
    // request exemptions from server
    this.getExemptions();
  }

  getExemptions() {
    this.featureStore.dispatch(new fromExemptionsActions.GetExemptions('KZTZ'));
  }
}
