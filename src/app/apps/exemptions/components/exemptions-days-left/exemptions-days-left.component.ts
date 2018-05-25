import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exemptions-days-left',
  styleUrls: ['exemptions-days-left.component.scss'],
  template: `
  <div class="my-progress__container" *ngIf="displayDays">
    <mat-progress-spinner
      class="my-progress__spinner"
      mode="determinate"
      [value]="days"
      [diameter]="40"
      [color]="color">
    </mat-progress-spinner>

    <span class="my-progress__value"
      title="{{ days }} days left">
          {{ displayDays }}
    </span>
  </div>
    `
})
export class ExemptionsDaysLeftComponent {
  @Input() days: number;
  @Input() color: string;
  constructor() {}

  get displayDays() {
    return this.days > 100 ? '' : this.days;
  }
}
