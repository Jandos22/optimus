import { LocationEnt } from './../../../shared/interface/locations.model';
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
  selector: 'app-sidenav-content-app',
  styleUrls: ['sidenav-content-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <a mat-list-item fxFlex
      class="sidenav__app"
      [routerLink]="app.RouterLink"
      [ngClass]="{ 'hidden': !app.Visible }"
      (click)="onSidenavClick.emit()">
      {{ app.Title }}
    </a>

    <app-harcs-status-check
      class="status-check-container"
      *ngIf="app.Title === 'HARCs'"
      [myLocation]="myLocation">
    </app-harcs-status-check>

    <app-exemptions-status-check
      class="status-check-container"
      *ngIf="app.Title === 'Exemptions'"
      [myLocation]="myLocation">
    </app-exemptions-status-check>
    `
})
export class SidenavContentAppComponent {
  @Input() app: AppItem;
  @Input() myLocation: LocationEnt;

  @Output() onSidenavClick = new EventEmitter<any>();
  constructor() {}
}
