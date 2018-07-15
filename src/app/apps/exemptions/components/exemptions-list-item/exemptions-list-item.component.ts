import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

// interfaces
import { ExemptionItem } from '../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-list-item',
  styleUrls: ['exemptions-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="common-list-item"
        fxLayout="row" fxLayoutAlign="start center"
        [ngClass]="{ lastItem: last }">
      Exemption
    </div>
    `
})
export class ExemptionsListItemComponent {
  @Input() exemption: ExemptionItem;
  @Input() last: boolean;

  @Output() openForm = new EventEmitter<ExemptionItem>();

  constructor() {}
}
