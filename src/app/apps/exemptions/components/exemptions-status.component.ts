import { Observable } from 'rxjs';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exemptions-status',
  styleUrls: ['exemptions-status.component.scss'],
  template: `
    <mat-chip-list>
      <mat-chip *ngIf="moreThan30days" color="primary" selected="true">VALID</mat-chip>
      <mat-chip *ngIf="lessThan30days" color="warn" selected="true">SOON EXPIRES</mat-chip>
    </mat-chip-list>
    `
})
export class ExemptionsStatusComponent {
  @Input() validTo: string;
  constructor() {}

  //   validTo: string;

  daysLeft(validTo: string) {
    const validToDate = new Date(validTo);
    const today = new Date();
    const daysLeft = Number(
      ((validToDate.getTime() - today.getTime()) / 86400000).toFixed(0)
    );
    return daysLeft;
  }

  get moreThan30days() {
    const left = this.daysLeft(this.validTo);
    console.log(left + ': ' + (left >= 30));
    return left >= 30 ? true : false;
  }

  get lessThan30days() {
    const left = this.daysLeft(this.validTo);
    return left < 30 ? true : false;
  }
}
