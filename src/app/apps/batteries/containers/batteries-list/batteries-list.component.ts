import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from "@angular/core";

// interfaces
import { BatteryItem } from "../../../../shared/interface/batteries.model";

@Component({
  selector: "app-batteries-list",
  styleUrls: ["batteries-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="batteries-list-container"
      fxFlex
      fxLayout="row wrap"
      fxLayoutAlign="start start"
      fxLayoutGap="16px"
    >
      <app-battery-list-item
        *ngFor="let battery of batteries; last as last"
        [battery]="battery"
        [ngClass]="{ 'last-item': last }"
        (openForm)="openForm.emit($event)"
        fxLayout="row nowrap"
      >
      </app-battery-list-item>
    </div>
  `
})
export class BatteriesListComponent {
  @Input()
  batteries: BatteryItem[];

  @Output()
  openForm = new EventEmitter<BatteryItem>();

  constructor() {}
}
