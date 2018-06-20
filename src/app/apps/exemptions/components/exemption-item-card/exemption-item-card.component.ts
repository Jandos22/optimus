import { Component, Input, OnDestroy } from '@angular/core';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';

// rxjs
import { Observable, Subscription } from 'rxjs';

// interfaces
import { Exemption } from './../../../../shared/interface/exemptions.model';
import { WindowProperties } from './../../../../shared/interface/layout.model';

@Component({
  selector: 'app-exemption-item-card',
  styleUrls: ['exemption-item-card.component.scss'],
  template: `
    <div fxFlex fxLayout="row" fxLayoutAlign="space-between start" fxLayoutGap="16px"
      style="margin: 8px 16px;">

        <mdc-card class="my-mdc-card" fxFlex>
          <mdc-card-primary-action fxFlex class="my-padding_8" mdc-ripple
            fxLayout="column" fxLayoutAlign="start stretch" fxLayoutGap="0.5rem">

              <div fxLayout="row" fxLayoutAlign="space-between">
                <span style="font-size: 0.875rem; color: #999">{{ exemption.ValidTo | date: 'dd.MM.yyyy' }}</span>
                <span fxFlex></span>
                <app-exemptions-status
                  [status]="status" [isXXS]="window.isXXS" [color]="color">
                </app-exemptions-status>
              </div>


              <span [title]="exemption.Title">{{ exemption.Title }}</span>

              <span class="my-item__secondrow" [class.textXXS]="window.isXXS"
                fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="8px">
                <!-- show link with exemption number if ID was provided -->
                <a *ngIf="exemption.Exemption_ID; else noId" [href]="composeLink(exemption.Exemption_ID)" target="_blank"
                  [class.text--accent]="lessThan30days">
                    {{ exemption.Exemption_Number }}
                </a>
                <!-- show just exemption number if no ID provided -->
                <ng-template #noId>
                  <span>{{ exemption.Exemption_Number }}</span>
                </ng-template>

              </span>

          </mdc-card-primary-action>
      </mdc-card>

      <!-- Spinner Container -->
      <app-exemptions-days-left fxFlex="40px" *ngIf="!moreThan100days"
        [days]="daysLeft()" [color]="color">
      </app-exemptions-days-left>

    </div>
    `
})
export class ExemptionItemCardComponent implements OnDestroy {
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

  get moreThan100days() {
    const left = this.daysLeft();
    return left >= 100 ? true : false;
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
