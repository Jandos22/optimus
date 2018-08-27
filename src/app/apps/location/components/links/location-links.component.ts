import { Component, Input } from '@angular/core';
import { LocationEnt } from '../../../../shared/interface/locations.model';

@Component({
  selector: 'app-location-links',
  styleUrls: ['location-links.component.scss'],
  template: `
    <div class="location-links-container"
        fxLayout="row wrap" fxLayoutAlign="start start">
        <div class="file-sharing">File Sharing</div>

        <app-location-link
            class="app-location-link"
            *ngIf="location?.Link1?.length"
            [linkType]="location?.Link1"
            [link]="location?.Link01">
        </app-location-link>

        <app-location-link
            class="app-location-link"
            *ngIf="location?.Link2?.length"
            [linkType]="location?.Link2"
            [link]="location?.Link02">
        </app-location-link>

        <app-location-link
            class="app-location-link"
            *ngIf="location?.Link3?.length"
            [linkType]="location?.Link3"
            [link]="location?.Link03">
        </app-location-link>

        <app-location-link
            class="app-location-link"
            *ngIf="location?.Link4?.length"
            [linkType]="location?.Link4"
            [link]="location?.Link04">
        </app-location-link>

    </div>
    `
})
export class LocationLinksComponent {
  @Input()
  location: LocationEnt;

  constructor() {}
}
