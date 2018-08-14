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
  requestor: PeopleItem;

  // list item with full list of properties
  $requestor: Subscription;
  requestorAll: PeopleItem;

  constructor(
    private srv: PeopleLookupService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.requestor && changes.requestor.currentValue) {
      this.handleInput(changes.requestor.currentValue);
    }
  }

  handleInput(requestor: PeopleItem) {
    this.$requestor = this.srv
      .getUserById(requestor.Id)
      .pipe(take(1))
      .subscribe((requestorAll: PeopleItem[]) => {
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
    this.$requestor.unsubscribe();
  }
}
