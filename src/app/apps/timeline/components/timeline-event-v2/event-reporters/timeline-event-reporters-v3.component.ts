import {
  Component,
  Input,
  Output,
  EventEmitter,
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
import {
  PathSlbSp,
  ApiPath,
  PathOptimus
} from '../../../../../shared/constants';

// services
import { PeopleLookupService } from '../../../../../shared/services';

// interfaces
import { PeopleItem } from '../../../../../shared/interface/people.model';

@Component({
  selector: 'app-timeline-event-reporters-v3',
  styleUrls: ['timeline-event-reporters-v3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="wrapper"
      fxLayout="row wrap"
      fxLayoutAlign="start start">

      <div
        *ngFor="let reporter of reporters; let i = index"
        class="reporter">
        <img *ngIf="reporter.Attachments" [src]="getPhotoUrl(reporter)" class="photo" [matTooltip]="reporter.Fullname">
      </div>

      <div *ngIf="!reporters" class="dummy"></div>

    </div>
    `
})
export class TimelineEventReportersV3Component
  implements OnInit, OnChanges, OnDestroy {
  @Input()
  reportersId: number[];

  // @Output()
  // onQuantityChange = new EventEmitter<number>();

  // event reporters, local variable, array of users
  // that is filled with results that come from server
  reporters: PeopleItem[];

  constructor(
    private srv: PeopleLookupService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // react to the changes of reportersId input
    // when changed, then run handleInput function
    if (changes.reportersId && changes.reportersId.currentValue) {
      this.handleInput(changes.reportersId.currentValue);
    }
  }

  handleInput(reportersId: number[]) {
    // console.log('handle');
    // console.log(reportersId);

    // if reportersId has ids
    if (reportersId.length) {
      // create observable made from numbers (ids of reporters)
      const list$: Observable<number> = from(reportersId);

      // subscribe to list$ observable
      // take n number of ids and unsubscribe after last
      // concatenate results from each server call
      // reduce all results to one array
      list$
        .pipe(
          take(Number(reportersId.length)),
          concatMap((id: number) => this.srv.getUserById(id)),
          reduce((acc: PeopleItem[], curr: PeopleItem) => {
            return [...acc, curr[0]];
          }, [])
        )
        // subscribe to end result
        // override reporters with new results
        .subscribe((result: PeopleItem[]) => {
          // console.log(result);
          this.reporters = result;
          // this.onQuantityChange.emit(result.length);
          this.cd.detectChanges();
        });
    }
  }

  getPhotoUrl(user: PeopleItem) {
    return PathSlbSp + user.AttachmentFiles.results[0].ServerRelativeUrl;
  }

  getMockPhotoUrl() {
    return PathOptimus + '/assets/images/engineer.png';
  }

  calcLeft(i: number, reporters: PeopleItem[]) {
    if (reporters.length > 1) {
      return i * 18 + 'px';
    } else {
      return i * 18 + 'px';
    }
  }

  calcTop(i: number, reporters: PeopleItem[]) {
    if (reporters.length > 1) {
      return i * 36 + i * 4 + 'px';
    } else {
      return i * 36 + 'px';
    }
  }

  calcZindex(i: number, reporters: PeopleItem[]) {
    if (reporters) {
      return reporters.length - i;
    } else {
      return 0;
    }
  }

  ngOnDestroy() {}
}
