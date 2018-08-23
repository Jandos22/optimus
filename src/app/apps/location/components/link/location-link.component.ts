import { Component, Input } from '@angular/core';
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { SpHyperlink } from '../../../../shared/interface/sp-hyperlink.model';

@Component({
  selector: 'app-location-link',
  styleUrls: ['location-link.component.scss'],
  template: `
    <div class="location-link-container"
        fxLayout="row nowrap" fxLayout="space-around center"
        (click)="navigate(link.Url)">

        <div class="linkType">
            <fa-icon *ngIf="linkType === 'OneDrive'" [icon]="['fas', 'cloud']"></fa-icon>
            <fa-icon *ngIf="linkType === 'Server'" [icon]="['fas', 'folder']"></fa-icon>
        </div>

        <div class="linkTitle" fxFlex>
            {{ link.Description }}
        </div>

    </div>
    `
})
export class LocationLinkComponent {
  @Input()
  linkType: string;

  @Input()
  link: SpHyperlink;

  constructor() {}

  navigate(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
