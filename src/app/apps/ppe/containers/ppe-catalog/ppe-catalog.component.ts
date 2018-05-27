import { Component, ViewEncapsulation, OnInit } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// ngrx
import { Store, select } from '@ngrx/store';

import * as fromFeature from '../../store';
import * as fromPpeActions from '../../store/actions/ppe.actions';

// services
import { PpeService } from './../../services/ppe.service';

@Component({
  selector: 'app-ppe-catalog.app-ppe-catalog__flex',
  styleUrls: ['ppe-catalog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-ppe-catalog-list
      [ppe_categories]="ppe_categories | async"
      [ppe_items]="ppe_items | async"
      [ppe_items_by_category]="ppe_items_by_category | async"
      class="ppe-catalog-list__flex">
    </app-ppe-catalog-list>
    `
})
export class PpeCatalogComponent implements OnInit {
  ppe_categories: Observable<any[]>;
  ppe_items: Observable<any[]>;
  ppe_items_by_category: Observable<any[]>;

  constructor(
    private featureStore: Store<fromFeature.PpeState>,
    private ppeService: PpeService
  ) {}

  ngOnInit() {
    this.featureStore.dispatch(new fromPpeActions.GetPpeCatalog());

    this.ppe_categories = this.featureStore.select(
      fromFeature.getPpeCategories
    );
    this.ppe_items = this.featureStore.select(fromFeature.getPpeItems);
    this.ppe_items_by_category = this.featureStore.select(
      fromFeature.getPpeItemsByCategory
    );
  }
}
