import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

// interface
import { AppItem } from '../../../shared/interface/applications.model';

@Component({
  selector: 'app-sidenav-content-app',
  styleUrls: ['sidenav-content-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <a mat-list-item class="sidenav__app"
        [routerLink]="app.RouterLink"
        [ngClass]="{ 'hidden': !app.Visible }">
        {{ app.Title }}
    </a>
    `
})
export class SidenavContentAppComponent {
  @Input() app: AppItem;
  constructor() {}
}
