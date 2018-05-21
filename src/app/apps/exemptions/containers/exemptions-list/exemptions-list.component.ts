import { Component, Input, OnDestroy } from '@angular/core';

// rxjs
import { Observable, Subscription, from } from 'rxjs';
import { map } from 'rxjs/operators';

// interfaces
import {
  Exemptions,
  ExemptionsRaw
} from './../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-list',
  styleUrls: ['exemptions-list.component.scss'],
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch"
        *ngFor="let exemption of (exemptions | async)">

        <div class="my-item-container"
            fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="1rem">

            <div class="my-progress__container">
                <mat-progress-spinner
                    class="my-progress__spinner"
                    [mode]="'determinate'"
                    [value]="10"
                    [diameter]="40">
                </mat-progress-spinner>

                <span class="my-progress__value">30</span>
            </div>

            <div class="my-item__title--container"
                fxFlex fxLayout="column" fxLayoutAlign="start stretch" style="overflow: hidden;">
                <span class="my-title__clipped" [title]="exemption.Title">{{ exemption.Title }}</span>

                <span class="my-item__secondrow">
                  <a *ngIf="exemption.Exemption_ID; else noId" [href]="composeLink(exemption.Exemption_ID)" target="_blank">
                      {{ exemption.Exemption_Number }}
                  </a>
                  <ng-template #noId>{{ exemption.Exemption_Number }}</ng-template>
                </span>

            </div>

            <span fxFlex="40px"></span>

        </div>
        <mat-divider *ngIf="!last"></mat-divider>

    </div>
    `
})
export class ExemptionsListComponent implements OnDestroy {
  @Input() exemptions: Observable<Exemptions[]>;
  exemptions$: Subscription;

  constructor() {}

  ngOnDestroy() {
    // this.exemptions$.unsubscribe();
  }

  // not used
  composeLink(id) {
    return id
      ? `https://quest.slb.com/quest/Exemption/ExemptionView.asp?Online=0&ID=${id}`
      : null;
  }
}
