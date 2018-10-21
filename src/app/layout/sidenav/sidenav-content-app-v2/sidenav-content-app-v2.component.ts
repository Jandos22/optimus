import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

// interface
import { AppItem } from '../../../shared/interface/applications.model';

@Component({
  selector: 'app-sidenav-content-app-v2',
  styleUrls: ['sidenav-content-app-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <a fxFlex
      class="sidenav-app-link"
      [routerLink]="app.RouterLink"
      routerLinkActive="active"
      [ngClass]="{ 'hidden': !app.Visible }"
      (click)="onSidenavClick.emit()">
      {{ app.Title }}
    </a>
    `
})
export class SidenavContentAppV2Component {
  @Input()
  app: AppItem;

  @Output()
  onSidenavClick = new EventEmitter<any>();

  constructor() {}
}
