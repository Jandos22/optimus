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
    <!--
    <div class='common-button my-footer'>
      <button mat-icon-button matTooltip='Configure Applications List'>
        <span class='fa_regular'><fa-icon [icon]="['fas', 'cog']"></fa-icon></span>
      </button>
    </div>
    -->
    <!--
    <div class='common-button my-footer'>
      <button mat-icon-button [matTooltip]="getToggleHiddenAppsMessage()"
        (click)="onToggleHiddenApps.emit()">
        <span class='fa_regular'><fa-icon [icon]="['fas', getToggleHiddenAppsIcon()]"></fa-icon></span>
      </button>
    </div>
    -->
    <div class='common-button my-footer'>
      <button mat-icon-button [matTooltip]="'Request new feature or improvement'"
        (click)="onFeatureRequest()">
        <span class='fa_regular'><fa-icon [icon]="['fas', 'registered']"></fa-icon></span>
      </button>
    </div>
    <div class='common-button my-footer'>
      <button mat-icon-button [matTooltip]="'Report a bug'"
        (click)="onBugReport()">
        <span class='fa_regular'><fa-icon [icon]="['fas', 'bug']"></fa-icon></span>
      </button>
    </div>
  `
})
export class SidenavFooterComponent {
  @Input()
  showHiddenApps: boolean;

  @Output()
  onToggleHiddenApps = new EventEmitter<any>();

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

  onFeatureRequest() {
    const subject = '?subject=Feature Request';
    const body =
      '&body=Describe what feature you think is worth to be implemented in Optimus ...';
    window.open(`mailto:zombayev@slb.com${subject}${body}`);
  }

  onBugReport() {
    const subject = '?subject=Bug Report';
    const body = '&body=Describe what kind of bug you observed ...';
    window.open(`mailto:zombayev@slb.com${subject}${body}`);
  }
}
