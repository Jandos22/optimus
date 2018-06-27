import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PaginationIndexes } from '../../../../shared/interface/pagination.model';

@Component({
  selector: 'app-timeline-footer',
  styleUrls: ['timeline-footer.component.scss'],
  template: `
    <div class="my__footer--pagination" fxLayout="row" fxLayoutAlign="space-between center">
        <span class="footerButton__container">
            <span class="footerButton__wrapper">
                <button mat-icon-button matTooltip="previous page"
                    *ngIf="indexes?.previous || indexes?.previous === 0" (click)="onBackClick()">
                    <fa-icon [icon]="['fas', 'chevron-left']"></fa-icon>
                </button>
            </span>
        </span>

        <span>
            {{
                totalDisplayed && from && to
                ? (from + ' - ' + to + (totalFound ? (' of ' + totalFound) : ''))
                : '0 results'
            }}
        </span>

        <span class="footerButton__container">
            <span class="footerButton__wrapper">
                <button mat-icon-button matTooltip="next page"
                    *ngIf="indexes?.next" (click)="onNextClick()">
                    <fa-icon [icon]="['fas', 'chevron-right']"></fa-icon>
                </button>
            </span>
        </span>
    </div>
    `
})
export class TimelineFooterComponent {
  // buttons - disabled or enabled
  back = false;
  next = false;

  @Input() indexes: PaginationIndexes;
  @Input() totalDisplayed: number;
  @Input() from: number;
  @Input() to: number;
  @Input() totalFound: any;

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
