import { PathSlbSp, ApiPath, PathOptimus } from '../../../../shared/constants';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ViewEncapsulation
} from '@angular/core';

// rxjs
import { Observable, Subscription, from } from 'rxjs';
import { take, reduce, concatMap, map } from 'rxjs/operators';

// interfaces
import { PeopleItem } from '../../../../shared/interface/people.model';

// services
import { PeopleLookupService } from '../../../../shared/services';

@Component({
  selector: 'app-timeline-event-reporters',
  styleUrls: ['timeline-event-reporters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="reporters_container" fxLayout="row">
        <span *ngIf="reps?.length > 1" [style.zIndex]="reps.length + 1" class="reporters__users--icon"
          fxLayout="row" fxLayoutAlign="center center">
          <fa-icon [icon]="['fas', 'users']"></fa-icon>
        </span>
        <span
            *ngFor="let rep of reps; let i = index" class="my_stack"
            [style.left]="calcLeft(i)"
            [style.zIndex]="calcZindex(i)">
            <img *ngIf="rep.Attachments" [src]="getPhotoUrl(rep)" class="userPhoto" [matTooltip]="rep.Fullname">
            <div *ngIf="!rep.Attachments" class="reporters__user--icon" fxLayout="row" fxLayoutAlign="center center">
              <fa-icon [icon]="['fas', 'user']"></fa-icon>
            </div>
        </span>
        <span fxLayout="column" fxLayoutAlign="center start"
            class="reporters_date_container"
            [style.left]="calcLeftDate()">
            <span class="reporter__container--authors">{{ getReportersName() }}</span>
            <span class="reporter__container--eventdate">{{ eventDate | date: 'longDate' }}</span>
        </span>
    </div>
    `
})
export class TimelineEventReportersComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() reporters: PeopleItem[];
  @Input() eventDate: Date;

  reps: PeopleItem[];

  constructor(private srv: PeopleLookupService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const reporters: SimpleChange = changes.reporters;
    this.handleReporters(reporters);
  }

  handleReporters(reporters: SimpleChange) {
    const reps: any[] = reporters.currentValue;

    if (reps.length) {
      const reps$: Observable<PeopleItem> = from(reps);

      reps$
        .pipe(
          take(Number(reps.length)),
          concatMap(user => {
            return this.srv.getUserById(user.ID);
          }),
          reduce((acc: PeopleItem[], curr: PeopleItem) => {
            return [...acc, curr[0]];
          }, [])
        )
        .subscribe(v => {
          // console.log(v);
          this.reps = v as PeopleItem[];
        });
    }
  }

  getPhotoUrl(rep: PeopleItem) {
    return PathSlbSp + rep.AttachmentFiles.results[0].ServerRelativeUrl;
  }

  getReportersName() {
    if (this.reps) {
      if (this.reps.length > 1) {
        return 'Multiple Authors';
      } else {
        return this.reps[0].Fullname;
      }
    } else {
      return '';
    }
  }

  calcLeft(i: number) {
    if (this.reps.length > 1) {
      return 18 + i * 18 + 'px';
    } else {
      return i * 18 + 'px';
    }
  }

  calcZindex(i) {
    if (this.reps) {
      return this.reps.length - i;
    } else {
      return 0;
    }
  }

  calcLeftDate() {
    if (this.reps && this.reps.length > 1) {
      return this.reps.length * 18 + 8 + 'px';
    } else if (this.reps && this.reps.length === 1) {
      return 36 + 8 + 'px';
    } else {
      return 0;
    }
  }

  ngOnDestroy() {
    // this.$reporters.unsubscribe();
  }
}
