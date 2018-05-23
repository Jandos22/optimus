import { Component, Input } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// interfaces
import { ExemptionsGrouped } from './../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-groups',
  styleUrls: ['exemptions-groups.component.scss'],
  template: `
        <app-exemption-group *ngFor="let group of (groups | async)" [group]="group">
        </app-exemption-group>
    `
})
export class ExemptionsGroupsComponent {
  @Input() groups: Observable<ExemptionsGrouped[]>;
  constructor() {}
}
