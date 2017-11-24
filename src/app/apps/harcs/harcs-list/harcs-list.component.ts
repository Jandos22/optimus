import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromHarcs from '../store/harcs.reducer';
import { MatProgressBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-harcs-list',
  templateUrl: './harcs-list.component.html',
  styleUrls: ['./harcs-list.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HarcsListComponent implements OnInit {

  harcs$: Observable<any>;

  constructor(private store: Store<fromHarcs.FeatureState>) { }

  ngOnInit() {
    this.harcs$ = this.store.select(fromHarcs.getHarcsList).map((harcs) => {
      if (harcs) { return this.recalculateHarcs(harcs); }
    });
  }

  getColorFromStatus(status) {
    switch (status) {
      case 'Pending Approval':
        return 'accent';

      case 'Approved':
        return 'primary';

      case 'Expired':
        return 'warn';

      default:
        return 'primary';
    }
  }

  recalculateHarcs (harcs) {
    let harcsMap: any[] = [...harcs];
    const today = Date.now();

    for (let i = 0; i < harcs.length; i++) {

      const harc = harcs[i];

      const validTo = Date.parse(harc.ValidTo);
      const daysLeft = Math.floor((validTo - today) / 86400000);
      const percentsLeft = Math.floor(daysLeft / 365 * 100);
      const qpidTemplate = 'http://quest.slb.com/quest/HARC/HARCView.asp?QPID=';
      const qpid = qpidTemplate.concat(harc.QPID);

      harcsMap[i] = {
        ...harcsMap[i],
        daysLeft: daysLeft,
        percentsLeft: percentsLeft,
        qpid: qpid
      };

      if (daysLeft <= 0) {
        harcsMap[i] = { ...harcsMap[i], Status: 'Expired', daysLeft: '', percentsLeft: 100 };
      }

    }

    return harcsMap;
  }

}
