import { Component, OnInit } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// ngrx
import { Store, select } from '@ngrx/store';

// state
import * as fromRoot from '../../../../store';
import * as fromFeature from '../../store';
import * as fromExemptionsActions from '../../store/actions/exemptions.actions';

// interfaces
import { Exemption } from '../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions',
  template: `
    <mat-tab-group>
      <mat-tab label="Exemptions ({{ (exemptions | async).length }})">
        <app-exemptions-list [exemptions]="exemptions | async"></app-exemptions-list>
      </mat-tab>
      <mat-tab label="Groups ({{ (groups | async).length }})">
        <app-exemptions-groups [groups]="groups"></app-exemptions-groups>
      </mat-tab>
    </mat-tab-group>
  `,
  styleUrls: ['./exemptions.component.scss']
})
export class ExemptionsComponent implements OnInit {
  // title in header
  appName = 'Exemptions';
  exemptions: Observable<Exemption[]>;
  groups: Observable<any>;

  constructor(
    private rootStore: Store<fromRoot.RootState>,
    private featureStore: Store<fromFeature.ExemptionsState>
  ) {}

  ngOnInit() {
    // update html page title
    this.rootStore.dispatch(new fromRoot.SetAppName(this.appName));

    // get exemptions list from store
    this.exemptions = this.featureStore.pipe(
      select(fromFeature.getExemptionsList)
    );

    // get grouped exemptions list from store
    this.groups = this.featureStore.pipe(
      select(fromFeature.getGroupedExemptionsList)
    );

    // when component starts
    // request exemptions from server
    this.getExemptions();
  }

  getExemptions() {
    this.featureStore.dispatch(new fromExemptionsActions.GetExemptions('KZTZ'));
  }
}
