import { WindowProperties } from './../../../../models/window-properties.m';
import { Component, Input, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';

// rxjs
import { Observable, Subscription, from } from 'rxjs';
import { map } from 'rxjs/operators';

// interfaces
import { ExemptionsRaw } from './../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-list',
  styleUrls: ['exemptions-list.component.scss'],
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch"
        *ngFor="let exemption of (exemptions | async)">

        <!-- List View -->
        <div class="my-item-container"
            fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="1rem">

            <!-- Spinner Container -->
            <app-exemptions-days-left
              [validTo]="exemption.ValidTo">
            </app-exemptions-days-left>

            <!-- Item Body Container -->
            <div class="my-item__title--container"
                fxFlex fxLayout="column" fxLayoutAlign="start stretch" style="overflow: hidden;" fxLayoutGap="5px">

                <!-- title container -->
                <div fxLayout="row" fxLayoutGap="8px">
                  <span fxFlex class="my-title__clipped" [title]="exemption.Title">{{ exemption.Title }}</span>
                  <span *ngIf="window.isXXS">{{ exemption.ValidTo | date: 'dd.MM.yyyy' }}</span>
                </div>

                <span class="my-item__secondrow" [class.textXXS]="window.isXXS"
                  fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="8px">
                  <!-- show link with exemption number if ID was provided -->
                  <a *ngIf="exemption.Exemption_ID; else noId" [href]="composeLink(exemption.Exemption_ID)" target="_blank">
                      {{ exemption.Exemption_Number }}
                  </a>
                  <!-- show just exemption number if no ID provided -->
                  <ng-template #noId>
                    <span>{{ exemption.Exemption_Number }}</span>
                  </ng-template>

                  <!-- always show exemption validity date -->
                  <span *ngIf="!window.isXXS">{{ exemption.ValidTo | date: 'dd.MM.yyyy' }}</span>

                  <!-- spacer -->
                  <span fxFlex></span>

                  <app-exemptions-status *ngIf="window.isXXS" fxFlex="0 0 auto"
                    [validTo]="exemption.ValidTo" [isXXS]="window.isXXS">
                  </app-exemptions-status>

                </span>

            </div>

            <app-exemptions-status fxFlex="0 0 auto"
                *ngIf="!window.isXXS"
                [validTo]="exemption.ValidTo"></app-exemptions-status>

        </div>
        <mat-divider *ngIf="!last"></mat-divider>

    </div>
    `
})
export class ExemptionsListComponent implements OnDestroy {
  @Input() exemptions: Observable<ExemptionsRaw[]>;
  breakpoints$: Subscription;

  window: WindowProperties;

  constructor(private rootStore: Store<fromRoot.RootState>) {
    // subscription to window layout
    this.breakpoints$ = this.rootStore
      .pipe(select(fromRoot.getLayoutWindow))
      .subscribe((window: WindowProperties) => (this.window = window));
  }

  // if exemption id is present, we can compose a link to quest
  composeLink(id) {
    return id
      ? `https://quest.slb.com/quest/Exemption/ExemptionView.asp?Online=0&ID=${id}`
      : null;
  }

  countDays(validity: string) {
    const validTo = new Date(validity);
    const today = new Date();
    return Number(
      ((validTo.getTime() - today.getTime()) / 86400000).toFixed(0)
    );
  }

  ngOnDestroy() {
    this.breakpoints$.unsubscribe();
  }
}
