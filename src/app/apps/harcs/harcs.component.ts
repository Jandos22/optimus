import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromHarcs from './store/harcs.reducer';
import * as application from '../../store/application.actions';
import * as harcs from './store/harcs.actions';

@Component({
  selector: 'app-harcs',
  templateUrl: './harcs.component.html',
  styleUrls: ['./harcs.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HarcsComponent implements OnInit, OnDestroy {

  appName = 'HARCs';

  constructor(private store: Store<fromHarcs.FeatureState>) { }

  ngOnInit() {
    this.store.dispatch(new application.ChangeAppName(this.appName));
  }

  ngOnDestroy() {
    this.store.dispatch(new harcs.ClearState);
  }


}
