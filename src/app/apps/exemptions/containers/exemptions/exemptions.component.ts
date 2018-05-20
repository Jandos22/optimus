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
    <h1 (click)="get()">Exemptions</h1>
    <p *ngFor="let item of (list | async)">{{ item }}</p>
  `,
  styleUrls: ['./exemptions.component.scss']
})
export class ExemptionsComponent implements OnInit {
  // title in header
  appName = 'Exemptions';
  list: Observable<any>;

  constructor(
    private rootStore: Store<fromRoot.RootState>,
    private featureStore: Store<fromFeature.ExemptionsState>
  ) {}

  ngOnInit() {
    // update html page title
    this.rootStore.dispatch(new fromRoot.ChangeAppName(this.appName));
    this.list = this.featureStore.pipe(select(fromFeature.getExemptionsList));
  }

  get() {
    this.featureStore.dispatch(new fromExemptionsActions.GetExemptions('KZTZ'));
  }
}
