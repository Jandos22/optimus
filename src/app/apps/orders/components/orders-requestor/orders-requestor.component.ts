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
  selector: 'app-orders-requestor',
  styleUrls: ['orders-requestor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="requestor-inner-container"
      fxLayout="row wrap" fxLayoutAlign="start start">

      <img *ngIf="requestorAll?.Attachments"
        class="requestor-photo"
        [src]="getPhotoUrl(requestorAll)"
        [matTooltip]="requestorAll?.Fullname">

      <img *ngIf="!requestorAll?.Attachments"
        class="requestor-photo"
        [src]="getMockPhotoUrl()"
        [matTooltip]="requestorAll?.Fullname">

    </div>
    `
})
export class OrdersRequestorComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  requestorId: number;

  // list item with full list of properties
  $requestorId: Subscription;
  requestorAll: PeopleItem;

  constructor(
    private srv: PeopleLookupService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.requestorId && changes.requestorId.currentValue) {
      this.handleInput(changes.requestorId.currentValue);
    }
  }

  handleInput(requestorId: number) {
    this.$requestorId = this.srv
      .getUserById(requestorId)
      .pipe(take(1))
      .subscribe((requestorAll: PeopleItem[]) => {
        console.log(requestorAll);
        this.requestorAll = { ...requestorAll[0] };
        this.cd.detectChanges();
      });
  }

  getPhotoUrl(user: PeopleItem) {
    return PathSlbSp + user.AttachmentFiles.results[0].ServerRelativeUrl;
  }

  getMockPhotoUrl() {
    return PathOptimus + '/assets/images/engineer.png';
  }

  ngOnDestroy() {
    this.$requestorId.unsubscribe();
  }
}
