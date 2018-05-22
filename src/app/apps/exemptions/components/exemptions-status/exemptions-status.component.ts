import { Observable } from 'rxjs';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exemptions-status',
  styleUrls: ['exemptions-status.component.scss'],
  template: `
    <mat-chip-list>
      <mat-chip *ngIf="!isXXS" [color]="color" selected="true" selectable="false">{{ status }}</mat-chip>
      <mat-basic-chip *ngIf="isXXS" [color]="color" selected="true" selectable="false">{{ status }}</mat-basic-chip>
    </mat-chip-list>
    `
})
export class ExemptionsStatusComponent {
  @Input() validTo: string;
  @Input() isXXS: boolean;
  constructor() {}

  //   validTo: string;

  daysLeft(validTo: string) {
    const validToDate = new Date(validTo);
    const today = new Date();
    const daysLeft = Number(
      ((validToDate.getTime() - today.getTime()) / 86400000).toFixed(0)
    );
    return daysLeft <= 0 ? 0 : daysLeft;
  }

  get moreThan30days() {
    const left = this.daysLeft(this.validTo);
    return left >= 30 ? true : false;
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
