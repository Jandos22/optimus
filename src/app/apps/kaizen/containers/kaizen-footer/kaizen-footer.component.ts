import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import {
  PaginationIndexes,
  PaginationCounter
} from '../../../../shared/interface/pagination.model';
import { PaginationState } from '../../store/reducers/pagination.reducer';

@Component({
  selector: 'app-kaizen-footer',
  styleUrls: ['kaizen-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="common-footer-container"
        fxLayout="row" fxLayoutAlign="space-between center">

        <div class='common-footer-button'>
            <button mat-icon-button matTooltip='Previous Page'
                *ngIf="pagination.links[pagination.currentIndex - 1]"
                (click)="this.onBack.emit()">
                <span class='fa_regular'><fa-icon [icon]="['fas', 'chevron-left']"></fa-icon></span>
            </button>
        </div>

        <div>
            <span *ngIf="!searching">{{ renderedFromTo }}{{ renderedTotal }}</span>
        </div>

        <div class='common-footer-button'>
            <button mat-icon-button matTooltip='Next Page'
                *ngIf="pagination.links[pagination.currentIndex + 1]"
                (click)="this.onNext.emit()">
                <span class='fa_regular'><fa-icon [icon]="['fas', 'chevron-right']"></fa-icon></span>
            </button>
        </div>

    </div>
  `
})
export class KaizenFooterComponent implements OnChanges {
  // buttons - disabled or enabled
  back = false;
  next = false;

  @Input()
  pagination: PaginationState;
  @Input()
  top: number;
  @Input()
  searching: boolean;

  @Output()
  onNext = new EventEmitter<any>();
  @Output()
  onBack = new EventEmitter<any>();

  renderedFromTo = '';
  renderedTotal = '';

  constructor() {}

  renderFromTo(p: PaginationState) {
    let result = '';

    if (p && p.totalDisplayed) {
      const from = p.currentIndex * this.top + 1;
      const to = from + p.totalDisplayed - 1;
      result += `${from} - ${to}`;
    } else {
      result += '0 results';
    }

    this.renderedFromTo = result;
  }

  renderTotal(p: PaginationState) {
    let result = '';

    if (p && p.totalExist) {
      result += p.totalExist < 500 ? ' of ' + p.totalExist : ' of 500+';
    }

    this.renderedTotal = result;
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when pagination properties change
    if (changes.pagination && !changes.pagination.firstChange) {
      this.renderFromTo(changes.pagination.currentValue);
      this.renderTotal(changes.pagination.currentValue);
    }
  }
}
