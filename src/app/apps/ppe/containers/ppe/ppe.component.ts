import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import { Observable } from 'rxjs';

// ngrx
import { Store, select } from '@ngrx/store';

// state
import * as fromRoot from '../../../../store';

@Component({
  selector: 'app-ppe.ppe-flex-container',
  styleUrls: ['ppe.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav mat-tab-nav-bar>
      <a mat-tab-link
        *ngFor="let link of navLinks"
        [routerLink]="link.path"
        routerLinkActive #rla="routerLinkActive"
        [active]="rla.isActive">
        {{ link.label }}
      </a>
    </nav>
    <router-outlet></router-outlet>
    `
})
export class PpeComponent {
  // title in header
  appName = 'PPE';

  navLinks = [
    { label: 'Catalog', path: 'catalog' },
    { label: 'Orders', path: 'orders' }
  ];

  constructor(
    private rootStore: Store<fromRoot.RootState>,
    private router: Router
  ) {
    // update html page title
    this.rootStore.dispatch(new fromRoot.SetAppName(this.appName));

    // redirect to default tab
    this.router.navigate(['ppe/catalog']);
  }
}
