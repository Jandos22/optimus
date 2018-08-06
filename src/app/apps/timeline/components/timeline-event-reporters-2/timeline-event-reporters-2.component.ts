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

// constants
import { PathSlbSp, ApiPath, PathOptimus } from '../../../../shared/constants';

// services
import { PeopleLookupService } from '../../../../shared/services';

// interfaces
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-timeline-event-reporters-2',
  styleUrls: ['timeline-event-reporters-2.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="event-reporters-container"
      fxLayout="row wrap" fxLayoutAlign="start start">
      <div class="event-reporter" *ngFor="let rep of reps"
        fxLayout="column nowrap" fxLayoutAlign="center center">
          <img *ngIf="rep.Attachments" [src]="getPhotoUrl(rep)" class="reporter-photo" [matTooltip]="rep.Fullname">
          <img *ngIf="!rep.Attachments" [src]="getMockPhotoUrl()" class="reporter-photo" [matTooltip]="rep.Fullname">
      </div>
    </div>
    `
})
export class TimelineEventReporters2Component
  implements OnInit, OnChanges, OnDestroy {
  @Input() reporters: PeopleItem[];

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

  getMockPhotoUrl() {
    return PathOptimus + '/assets/images/engineer.png';
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

  ngOnDestroy() {
    // this.$reporters.unsubscribe();
  }
}
