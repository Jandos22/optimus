import { Store } from '@ngrx/store';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as fromRoot from '../../store/app.reducers';
import * as application from '../../store/application.actions';
import * as layout from '../../store/layout.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent implements OnInit {

  locations: object[];
  selectedLocation: string;

  constructor(private store: Store<fromRoot.State>) {
    this.locations = [{ code: 'KZTZ' }, { code: 'KZAU' }];
    this.selectedLocation = 'KZTZ';
   }

  ngOnInit() {
    this.store.dispatch(new application.GetLocations());
  }

  toggleSidenav() {
    this.store.dispatch(new layout.ToggleSidenav());
  }

}
