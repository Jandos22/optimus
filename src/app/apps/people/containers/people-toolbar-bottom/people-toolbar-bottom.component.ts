import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PaginationIndexes } from './../../models/pagination-indexes.model';

@Component({
  selector: 'app-people-toolbar-bottom',
  styleUrls: ['people-toolbar-bottom.component.css'],
  template: `
    <mat-toolbar-row class="toolbarForPaging">
      <div fxLayout="row" fxLayoutAlign="space-between center" fxFlexFill>

        <span class="footerButton">
          <button mat-icon-button *ngIf="indexes?.previous || indexes?.previous === 0" (click)="onBackClick()">
            <mat-icon>navigate_before</mat-icon>
          </button>
        </span>

        <span>
          {{
            listLength && from && to
            ? (from + ' - ' + to + (total ? (' of ' + total) : ''))
            : '0 results'
          }}
        </span>

        <span class="footerButton">
          <button mat-icon-button *ngIf="indexes?.next" (click)="onNextClick()">
            <mat-icon>navigate_next</mat-icon>
          </button>
        </span>

      </div>
    </mat-toolbar-row>
  `
})
export class PeopleToolbarBottomComponent {
  // buttons - disabled or enabled
  back = false;
  next = false;

  @Input() indexes: PaginationIndexes;
  @Input() listLength: number;
  @Input() from: number;
  @Input() to: number;
  @Input() total: any;

  @Output() onNext = new EventEmitter<any>();
  @Output() onBack = new EventEmitter<any>();

  constructor() {}

  onBackClick() {
    this.onBack.emit(this.indexes);
  }

  onNextClick() {
    this.onNext.emit(this.indexes);
  }
}
