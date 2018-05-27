import { Component, ViewEncapsulation, Input } from '@angular/core';

// interfaces
import {
  PpeCategory,
  PpeItem,
  PpeItemsByCategory
} from './../../../../shared/interface/ppe.model';

@Component({
  selector: 'app-ppe-catalog-list',
  styleUrls: ['ppe-catalog-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <mat-accordion>
      <mat-expansion-panel *ngFor="let cat of ppe_items_by_category"
        class="ppe-catalog-list__expansionpanel">
        <mat-expansion-panel-header>
          <mat-panel-title>{{ cat.category }}</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="ppe-item-card__items--container"
          fxLayout="row nowrap" fxLayoutAlign="start start" fxLayoutGap="16px">
          <app-ppe-item-card
            *ngFor="let item of cat.items"
            [item]="item"
            fxFlex="200px">
          </app-ppe-item-card>
        </div>
      </mat-expansion-panel>
    </mat-accordion>
    `
})
export class PpeCatalogListComponent {
  @Input() ppe_categories: PpeCategory[];
  @Input() ppe_items: PpeItem[];
  @Input() ppe_items_by_category: PpeItemsByCategory[];
  constructor() {}
}
