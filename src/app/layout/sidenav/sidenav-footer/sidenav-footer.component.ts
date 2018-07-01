import {
  Component,
  Output,
  ViewEncapsulation,
  EventEmitter,
  Input
} from '@angular/core';

@Component({
  selector: 'app-sidenav-footer',
  styleUrls: ['sidenav-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class='common-button my-footer'>
      <button mat-icon-button matTooltip='Configure Applications List'>
        <span class='fa_regular'><fa-icon [icon]="['fas', 'cog']"></fa-icon></span>
      </button>
    </div>
    <div class='common-button my-footer'>
      <button mat-icon-button [matTooltip]="getToggleHiddenAppsMessage()"
        (click)="onToggleHiddenApps.emit()">
        <span class='fa_regular'><fa-icon [icon]="['fas', getToggleHiddenAppsIcon()]"></fa-icon></span>
      </button>
    </div>
  `
})
export class SidenavFooterComponent {
  @Input() showHiddenApps: boolean;

  @Output() onToggleHiddenApps = new EventEmitter<any>();

  constructor() {}

  getToggleHiddenAppsIcon() {
    if (!this.showHiddenApps) {
      return 'eye';
    } else {
      return 'eye-slash';
    }
  }

  getToggleHiddenAppsMessage() {
    if (this.showHiddenApps) {
      return 'Hide Hidden Applications';
    } else {
      return 'Show Hidden Applications';
    }
  }
}
