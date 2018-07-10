import { Component, Input, ViewEncapsulation } from '@angular/core';

// interfaces
import { PpeItem } from '../../../../shared/interface/ppe.model';

// constants
import { ApiPath, PathSlbSp } from '../../../../shared/constants';

@Component({
  selector: 'app-ppe-item-card',
  styleUrls: ['ppe-item-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <mdc-card>
      <mdc-card-primary-action>
        <mdc-card-media [square]="true" *ngIf="item.Attachments"
          [ngStyle]="{ 'background-image': 'url(' + imageUrl + ')'}">
        </mdc-card-media>
        <div class="ppe-item-card__primary" fxLayout="column" fxLayoutGap="16px">
          <div>{{ item.Title }}</div>
          <div fxLayout="row" fxLayoutAlign="space-between">
            <span>{{ item.Price }}</span>
            <span>{{ item.Supplier.Title }}</span>
          </div>
        </div>
      </mdc-card-primary-action>
    </mdc-card>
    `
})
export class PpeItemCardComponent {
  @Input() item: PpeItem;
  constructor() {}

  get imageUrl() {
    const path = this.item.AttachmentFiles[0].ServerRelativeUrl;
    return ApiPath.startsWith('_') ? `${PathSlbSp}`.concat(path) : path;
  }
}
