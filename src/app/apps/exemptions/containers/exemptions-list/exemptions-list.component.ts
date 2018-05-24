import { Component, Input } from '@angular/core';

// interface
import { Exemption } from './../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-list',
  styleUrls: ['exemptions-list.component.scss'],
  template: `
    <app-exemption-item *ngFor="let exemption of exemptions" [exemption]="exemption"></app-exemption-item>
  `
})
export class ExemptionsListComponent {
  @Input() exemptions: Exemption[];
  constructor() {}
}
