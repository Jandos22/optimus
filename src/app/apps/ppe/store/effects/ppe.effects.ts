import { Injectable } from '@angular/core';

// ngrx
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

// rxjs
import { of, Observable, forkJoin, from } from 'rxjs';
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  tap,
  take,
  reduce,
  filter,
  takeWhile
} from 'rxjs/operators';

// actions
import { PpeActionsUnion, PpeActionTypes } from '../actions/ppe.actions';
import * as ActionsInPpe from '../actions/ppe.actions';

// services
import { PpeService } from './../../services/ppe.service';

// interfaces
import {
  PpeCategory,
  PpeItem,
  PpeItemsByCategory
} from './../../../../shared/interface/ppe.model';

@Injectable()
export class PpeEffects {
  constructor(private actions$: Actions, private service: PpeService) {}

  @Effect()
  getPpeCatalog$ = this.actions$.pipe(
    ofType(PpeActionTypes.GET_PPE_CATALOG),
    switchMap(() => {
      const ppe_categories$ = this.service.getPPECategories();
      const ppe_items$ = this.service.getPPEItems();
      return forkJoin(ppe_categories$, ppe_items$);
    }),
    mergeMap((catalog: [PpeCategory[], PpeItem[]]) => {
      return [
        new ActionsInPpe.WritePpeCategories(catalog[0]),
        new ActionsInPpe.WritePpeItems(catalog[1]),
        new ActionsInPpe.GroupItemsByCategory(catalog)
      ];
    })
  );

  @Effect()
  //   @Effect({ dispatch: false })
  groupItemsByCategories$ = this.actions$.pipe(
    ofType(PpeActionTypes.GROUP_ITEMS_BY_CATEGORY),
    map((action: ActionsInPpe.WriteGroupedPpeItems) => action.payload),
    map((data: [PpeCategory[], PpeItem[]]) => {
      const categories$: Observable<PpeCategory> = from(data[0]);
      const n_of_categories = Number(data[0].length);

      const items$: Observable<PpeItem> = from(data[1]);
      const n_of_items = Number(data[1].length);

      let results: PpeItemsByCategory[] = [];

      console.log('categories: ', n_of_categories);
      console.log('items: ', n_of_items);

      categories$
        .pipe(
          take(n_of_categories),
          reduce((acc: PpeItemsByCategory[], category: PpeCategory) => {
            let current_items = [];

            items$
              .pipe(
                take(n_of_items),
                filter((item: PpeItem) => {
                  return item.CategoryId === category.Id;
                }),
                reduce((acc_items: PpeItem[], item: PpeItem) => {
                  return [...acc_items, item];
                }, [])
              )
              .subscribe(x => (current_items = x));

            return [...acc, { category: category.Title, items: current_items }];
          }, [])
        )
        .subscribe(x => (results = x));

      return new ActionsInPpe.WriteGroupedPpeItems(results);
    })
  );
}
