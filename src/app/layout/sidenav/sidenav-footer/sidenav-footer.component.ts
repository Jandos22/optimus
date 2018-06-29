import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidenav-footer',
  styleUrls: ['sidenav-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div fxFlex class="sidenav__footer--container" fxLayout="row" fxLayoutAlign="start center">
        <span matTooltip="Optimization Suite">Optimus</span>
    </div>
    `
})
export class SidenavFooterComponent {
  constructor() {}
}
