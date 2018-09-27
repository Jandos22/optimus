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
  selector: 'app-harcs-pic',
  styleUrls: ['harcs-pic.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pic-inner-container"
      fxLayout="row wrap" fxLayoutAlign="start start">

      <img
        *ngIf="picFull?.Attachments"
        [src]="getPhotoUrl(picFull)"
        class="pic-photo"
        [matTooltip]="'followed up by ' + picFull?.Fullname"
        matTooltipClass="mytooltip medium-text">

      <img
        *ngIf="!picFull?.Attachments"
        [src]="getMockPhotoUrl()"
        class="pic-photo"
        [matTooltip]="'followed up by ' + picFull?.Fullname"
        matTooltipClass="mytooltip medium-text">

    </div>
    `
})
export class HarcsPicComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  pic: PeopleItem;

  // list item with full list of properties
  $pic: Subscription;
  picFull: PeopleItem;

  constructor(
    private srv: PeopleLookupService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const pic: SimpleChange = changes.pic;
    this.handleInput(pic);
  }

  handleInput(pic: SimpleChange) {
    // console.log(pic);
    const curr_pic: PeopleItem = pic.currentValue;

    this.$pic = this.srv
      .getUserById(curr_pic.ID)
      .pipe(take(1))
      .subscribe((full_pic: PeopleItem[]) => {
        // console.log(full_pic[0]);
        this.picFull = { ...full_pic[0] };
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
    this.$pic.unsubscribe();
  }
}
