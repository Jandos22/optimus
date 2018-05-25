import { ExemptionsGrouped } from './../../../../shared/interface/exemptions.model';
import { Component, Input } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exemption-group',
  styleUrls: ['exemption-group.component.scss'],
  template: `
        <h3 class="my-section">{{ group.group }} [{{ numberOfExemptions }}]</h3>
        <app-exemption-item-card *ngFor="let exemption of group.exemptions; last as last" [exemption]="exemption"></app-exemption-item-card>
    `
})
export class ExemptionGroupComponent {
  @Input() group: ExemptionsGrouped;
  constructor() {}

  get numberOfExemptions() {
    return Number(this.group.exemptions.length);
  }
}
