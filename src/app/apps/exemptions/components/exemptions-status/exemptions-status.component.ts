import { Observable } from 'rxjs';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exemptions-status',
  styleUrls: ['exemptions-status.component.scss'],
  template: `
    <mat-chip-list>
      <!-- <mat-chip *ngIf="!isXXS" [color]="color" selected="true" selectable="false">{{ status }}</mat-chip> -->
      <mat-basic-chip [color]="color" selected="true" selectable="false">{{ status }}</mat-basic-chip>
    </mat-chip-list>
    `
})
export class ExemptionsStatusComponent {
  @Input() isXXS: boolean;
  @Input() status: string;
  @Input() color: string;
  constructor() {}
}
