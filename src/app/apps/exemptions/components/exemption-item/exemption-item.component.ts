import { WindowProperties } from './../../../../models/window-properties.m';
import { Component, Input, OnDestroy } from '@angular/core';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';

// rxjs
import { Observable, Subscription } from 'rxjs';

// interfaces
import { Exemption } from './../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemption-item',
  styleUrls: ['exemption-item.component.scss'],
  template: `
        <div class="my-item-container"
            fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="1rem">

          <!-- Spinner Container -->
          <app-exemptions-days-left
            [days]="daysLeft()" [color]="color">
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
              [status]="status" [isXXS]="window.isXXS" [color]="color">
            </app-exemptions-status>

          </span>
          </div>

          <app-exemptions-status fxFlex="0 0 auto" *ngIf="!window.isXXS"
            [status]="status" [isXXS]="window.isXXS" [color]="color"></app-exemptions-status>

      </div>
    `
})
export class ExemptionItemComponent implements OnDestroy {
  @Input() exemption: Exemption;
  breakpoints$: Subscription;
  window: WindowProperties;

  constructor(private rootStore: Store<fromRoot.RootState>) {
    // subscription to window layout
    this.breakpoints$ = this.rootStore
      .pipe(select(fromRoot.getLayoutWindow))
      .subscribe((window: WindowProperties) => (this.window = window));
  }

  daysLeft() {
    const validToDate = new Date(this.exemption.ValidTo);
    const today = new Date();
    const daysLeft = Number(
      ((validToDate.getTime() - today.getTime()) / 86400000).toFixed(0)
    );
    return daysLeft <= 0 ? 0 : daysLeft;
  }

  // if exemption id is present, we can compose a link to quest
  composeLink(id) {
    return id
      ? `https://quest.slb.com/quest/Exemption/ExemptionView.asp?Online=0&ID=${id}`
      : null;
  }

  get moreThan30days() {
    const left = this.daysLeft();
    return left >= 30 ? true : false;
  }

  get lessThan30days() {
    const left = this.daysLeft();
    return left < 30 && left > 0 ? true : false;
  }

  get status() {
    return this.moreThan30days
      ? 'VALID'
      : this.lessThan30days
        ? 'SOON EXPIRES'
        : 'EXPIRED';
  }

  get color() {
    return this.status === 'VALID'
      ? 'primary'
      : this.status === 'SOON EXPIRES'
        ? 'accent'
        : this.status === 'EXPIRED'
          ? 'warn'
          : '';
  }

  ngOnDestroy() {
    this.breakpoints$.unsubscribe();
  }
}
