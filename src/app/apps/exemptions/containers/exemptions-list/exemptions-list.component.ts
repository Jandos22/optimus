import { Component, Input, OnDestroy } from '@angular/core';

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
            <div class="my-progress__container">
                <mat-progress-spinner
                    class="my-progress__spinner"
                    [mode]="'determinate'"
                    [value]="10"
                    [diameter]="40">
                </mat-progress-spinner>

                <span class="my-progress__value"
                    title="{{ countDays(exemption.ValidTo) }} days left">
                        {{ countDays(exemption.ValidTo) }}
                </span>
            </div>

            <!-- Item Body Container -->
            <div class="my-item__title--container"
                fxFlex fxLayout="column" fxLayoutAlign="start stretch" style="overflow: hidden;" fxLayoutGap="5px">
                <span class="my-title__clipped" [title]="exemption.Title">{{ exemption.Title }}</span>

                <span class="my-item__secondrow">
                  <!-- show link with exemption number if ID was provided -->
                  <a *ngIf="exemption.Exemption_ID; else noId" [href]="composeLink(exemption.Exemption_ID)" target="_blank">
                      {{ exemption.Exemption_Number }}
                  </a>
                  <!-- show just exemption number if no ID provided -->
                  <ng-template #noId><span>{{ exemption.Exemption_Number }}</span></ng-template>
                  <!-- always show exemption validity date -->
                  <span> - {{ exemption.ValidTo | date }}</span>

                </span>

            </div>

            <app-exemptions-status fxFlex="0 0 auto"
                [validTo]="exemption.ValidTo"></app-exemptions-status>

        </div>
        <mat-divider *ngIf="!last"></mat-divider>

    </div>
    `
})
export class ExemptionsListComponent implements OnDestroy {
  @Input() exemptions: Observable<ExemptionsRaw[]>;

  constructor() {}

  ngOnDestroy() {}

  // not used
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
}
