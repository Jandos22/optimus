import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

// date-fns
import * as differenceInDays from 'date-fns/difference_in_days';
import * as distanceInWords from 'date-fns/distance_in_words';
import * as startOfToday from 'date-fns/start_of_today';

// rxjs
import { Observable, Subscription, from } from 'rxjs';
import { take, reduce, concatMap, map } from 'rxjs/operators';

// constants
import { PathSlbSp, ApiPath, PathOptimus } from '../../../../shared/constants';

// services
import { PeopleLookupService } from '../../../../shared/services';

// interfaces
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-orders-last-updated',
  styleUrls: ['orders-last-updated.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="order-last-updated" fxLayout="row nowrap"
      *ngIf="lastUpdatedFlag"
      [ngClass]="{ 'recent': isRecent, 'old': !isRecent }">

      <div fxFlex="16px" class="icon">

        <fa-icon *ngIf="!isRecent" [icon]="['fas', 'exclamation-circle']">
        </fa-icon>

        <fa-icon *ngIf="isRecent" [icon]="['fas', 'check-circle']">
        </fa-icon>

      </div>

      <div fxFlex class="text">{{ lastUpdated }}</div>

    </div>
    `
})
export class OrdersLastUpdatedComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input()
  lastUpdatedById: number;

  @Input()
  lastUpdatedDate: Date;

  @Input()
  lastUpdatedFlag: boolean;

  $lastUpdatedById: Subscription;

  lastUpdatedAll: PeopleItem;

  constructor(
    private srv: PeopleLookupService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lastUpdatedById && changes.lastUpdatedById.currentValue) {
      this.handleInput(changes.lastUpdatedById.currentValue);
    }
  }

  get isRecent() {
    const daysAgo = differenceInDays(startOfToday(), this.lastUpdatedDate);
    return daysAgo < 14 ? true : false;
  }

  get lastUpdated() {
    if (this.lastUpdatedAll) {
      const distance = distanceInWords(Date.now(), this.lastUpdatedDate);
      const who = this.lastUpdatedAll.Fullname;
      return 'updated ' + distance + ' ago by ' + who;
    } else {
      return 'working...';
    }
  }

  handleInput(lastUpdatedById: number) {
    this.$lastUpdatedById = this.srv
      .getUserById(lastUpdatedById)
      .pipe(take(1))
      .subscribe((lastUpdatedAll: PeopleItem[]) => {
        this.lastUpdatedAll = { ...lastUpdatedAll[0] };
        this.cd.detectChanges();
      });
  }

  ngOnDestroy() {
    this.$lastUpdatedById.unsubscribe();
  }
}
