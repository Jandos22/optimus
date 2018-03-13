import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PaginationIndexes } from './../../models/pagination-indexes.model';

@Component({
  selector: 'app-people-toolbar-bottom',
  styleUrls: ['people-toolbar-bottom.component.css'],
  template: `
    <mat-toolbar-row class="toolbarForPaging">
      <div fxLayout="row" fxLayoutAlign="space-between center" fxFlexFill>

        <span class="footerButton">
          <button mat-icon-button *ngIf="indexes?.prev || indexes?.prev === 0" (click)="onPrevClick()">
            <mat-icon>navigate_before</mat-icon>
          </button>
        </span>

        <span>Center</span>

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

  @Output() onNext = new EventEmitter<any>();
  @Output() onPrev = new EventEmitter<any>();

  constructor() {}

  onPrevClick() {
    this.onPrev.emit(this.indexes);
  }

  onNextClick() {
    this.onNext.emit();
  }
}
