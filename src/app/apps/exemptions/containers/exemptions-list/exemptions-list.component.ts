import { Component, Input } from '@angular/core';

// interface
import { Exemption } from './../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-list',
  styleUrls: ['exemptions-list.component.scss'],
  template: `
    <app-exemption-item-card fxLayout="row" *ngFor="let exemption of exemptions" [exemption]="exemption"></app-exemption-item-card>
  `
})
export class ExemptionsListComponent {
  @Input() exemptions: Exemption[];
  constructor() {}
}
