import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-orders-links',
  styleUrls: ['orders-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
        <div class="orders-links-container" fxLayout="row nowrap" fxLayoutAlign="start start" fxLayoutGap="12px">

            <div class="link-active"
                matTooltip="Open SWPS in new tab"
                (click)="openSWPS()">
                SWPS
            </div>

            <div class="link-active"
                matTooltip="Open 1-Click in new tab"
                (click)="openOneClick()">
                1-Click
            </div>

            <div class="link-active"
                *ngIf="isRCA"
                matTooltip="Open MCT in new tab"
                (click)="openMCT()">
                MCT
            </div>

            <div class="link-inactive"
                matTooltip="Coming Soon">
                Part Numbers
            </div>

        </div>
    `
})
export class OrdersLinksComponent {
  @Input()
  location: number;

  constructor() {}

  get isRCA() {
    return this.location === 2 || this.location === 4 ? true : false;
  }

  openSWPS() {
    window.open(`https://www.swps.slb.com/`, '_blank');
  }

  openOneClick() {
    window.open(
      `https://www.swps.slb.com/procurement/WebDriver?ACT=RequestPortalNewRequestDisplay&EID=1`,
      '_blank'
    );
  }

  openMCT() {
    window.open(
      `https://slb001.sharepoint.com/sites/RCAMM/Lists/MRCRTT`,
      '_blank'
    );
  }
}
