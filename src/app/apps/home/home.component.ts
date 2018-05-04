import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';

// ngrx
import * as fromRoot from '../../store';
import * as application from '../../store/actions/application.action';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  appName = 'Home';

  constructor(private store: Store<fromRoot.RootState>) {}

  ngOnInit() {
    this.store.dispatch(new application.ChangeAppName(this.appName));
  }
}
