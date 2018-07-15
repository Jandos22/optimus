import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

// interfaces
import { ExemptionItem } from '../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-list',
  styleUrls: ['exemptions-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="exemptions-list--container" fxFlex
      fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="16px">

      <app-exemptions-list-item *ngFor="let exemption of exemptions; last as last" [exemption]="exemption"
        [ngClass]="{ 'exemption-last': last }"
        (openForm)="openForm.emit($event)">
      </app-exemptions-list-item>

    </div>
    `
})
export class ExemptionsListComponent {
  @Input() exemptions: ExemptionItem[];

  @Output() openForm = new EventEmitter<ExemptionItem>();

  constructor() {}
}
