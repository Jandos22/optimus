import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../../store';
import * as fromLayoutActions from '../../../../store/actions/layout.actions';

@Component({
  selector: 'app-timeline-toolbar-button-menu',
  styleUrls: ['timeline-toolbar-button-menu.component.scss'],
  template: `
    <!-- opens and closes sidenav -->
    <div class="common-button">
        <button mat-icon-button (click)="toggleSidenav()">
            <span class="fa_regular"><fa-icon [icon]="['fas', 'bars']"></fa-icon></span>
        </button>
    </div>
    `
})
export class TimelineToolbarButtonMenuComponent {
  constructor(private store: Store<fromRoot.RootState>) {}

  toggleSidenav() {
    this.store.dispatch(new fromLayoutActions.ToggleSidenav());
  }
}
