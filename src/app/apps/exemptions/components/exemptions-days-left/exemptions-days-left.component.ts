import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exemptions-days-left',
  styleUrls: ['exemptions-days-left.component.scss'],
  template: `
  <div class="my-progress__container">
    <mat-progress-spinner
      class="my-progress__spinner"
      mode="determinate"
      [value]="days"
      [diameter]="40"
      [color]="color">
    </mat-progress-spinner>

    <span class="my-progress__value"
      title="{{ days }} days left">
          {{ days }}
    </span>
  </div>
    `
})
export class ExemptionsDaysLeftComponent {
  @Input() validTo: string;
  constructor() {}

  get days() {
    return this.daysLeft(this.validTo);
  }

  //   daysLeft() {
  //     const validTo = new Date(this.validTo);
  //     const today = new Date();
  //     return Number(
  //       ((validTo.getTime() - today.getTime()) / 86400000).toFixed(0)
  //     );
  //   }

  daysLeft(validTo: string) {
    const validToDate = new Date(validTo);
    const today = new Date();
    const daysLeft = Number(
      ((validToDate.getTime() - today.getTime()) / 86400000).toFixed(0)
    );
    return daysLeft <= 0 ? 0 : daysLeft;
  }

  get moreThan30days() {
    return this.daysLeft(this.validTo) >= 30 ? true : false;
  }

  get lessThan30days() {
    const left = this.daysLeft(this.validTo);
    return left < 30 && left > 0 ? true : false;
  }

  get status() {
    return this.moreThan30days
      ? 'VALID'
      : this.lessThan30days
        ? 'SOON EXPIRES'
        : 'EXPIRED';
  }

  get color() {
    return this.status === 'VALID'
      ? 'primary'
      : this.status === 'SOON EXPIRES'
        ? 'accent'
        : this.status === 'EXPIRED'
          ? 'warn'
          : '';
  }
}
