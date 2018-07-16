import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// interfaces
import { HarcItem } from '../../../../shared/interface/harcs.model';

@Component({
  selector: 'app-harcs-list',
  styleUrls: ['harcs-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="harcs-list-container" fxFlex
      fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="16px">

      <app-harcs-list-item
        *ngFor="let harc of harcs; last as last"
        [harc]="harc"
        [ngClass]="{
          'last-item': last,
          'status-pending': (harc.Status === 'Pending')
        }"
        (openForm)="openForm.emit($event)">
      </app-harcs-list-item>

    </div>
    `
})
export class HarcsListComponent {
  @Input() harcs: HarcItem[];

  @Output() openForm = new EventEmitter<HarcItem>();

  constructor() {}
}
