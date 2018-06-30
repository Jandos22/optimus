import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidenav-footer',
  styleUrls: ['sidenav-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class='common-button my-footer'>
      <button mat-icon-button matTooltip='Configure Applications list'>
        <span class='fa_regular'><fa-icon [icon]="['fas', 'cog']"></fa-icon></span>
      </button>
    </div>
    <span matTooltip="Optimization Suite">Optimus</span>
  `
})
export class SidenavFooterComponent {
  constructor() {}
}
