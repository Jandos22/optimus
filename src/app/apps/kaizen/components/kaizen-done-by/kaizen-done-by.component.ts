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
  selector: 'app-kaizen-done-by',
  styleUrls: ['kaizen-done-by.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="doneby_container" fxLayout="row">
        <span
            *ngFor="let doneBy of doneByList; let i = index" class="doneby_stack"
            [style.left]="calcLeft(i)"
            [style.zIndex]="calcZindex(i)">
            <img *ngIf="doneBy.Attachments" [src]="getPhotoUrl(doneBy)" class="kaizen-user-photo" [matTooltip]="doneBy.Fullname">
            <div *ngIf="!doneBy.Attachments" class="doneby__user--icon" fxLayout="row" fxLayoutAlign="center center">
              <fa-icon [icon]="['fas', 'user']"></fa-icon>
            </div>
        </span>
        <span fxLayout="column" fxLayoutAlign="center start"
            class="doneby_date_container"
            [style.left]="calcLeftDate()">
            <span class="reporter__container--authors">{{ getFullname() }}</span>
            <span class="reporter__container--eventdate">{{ projectDate | date: 'longDate' }}</span>
        </span>
    </div>
    `
})
export class KaizenDoneByComponent implements OnInit, OnChanges, OnDestroy {
  @Input() doneBy: PeopleItem[];
  @Input() projectDate: Date;

  doneByList: PeopleItem[];

  constructor(private srv: PeopleLookupService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const doneBy: SimpleChange = changes.doneBy;
    this.handleReporters(doneBy);
  }

  handleReporters(doneBy: SimpleChange) {
    const doneByList: any[] = doneBy.currentValue;

    if (doneByList.length) {
      const doneByList$: Observable<PeopleItem> = from(doneByList);

      doneByList$
        .pipe(
          take(Number(doneByList.length)),
          concatMap(user => {
            return this.srv.getUserById(user.ID);
          }),
          reduce((acc: PeopleItem[], curr: PeopleItem) => {
            return [...acc, curr[0]];
          }, [])
        )
        .subscribe(v => {
          console.log(v);
          this.doneByList = v as PeopleItem[];
        });
    }
  }

  getPhotoUrl(doneBy: PeopleItem) {
    return PathSlbSp + doneBy.AttachmentFiles.results[0].ServerRelativeUrl;
  }

  getFullname() {
    if (this.doneByList) {
      if (this.doneByList.length > 1) {
        return 'Teamwork';
      } else {
        return this.doneByList[0].Fullname;
      }
    } else {
      return '';
    }
  }

  calcLeft(i: number) {
    if (this.doneByList.length > 1) {
      return i * 18 + 'px';
    } else {
      return i * 18 + 'px';
    }
  }

  calcZindex(i) {
    if (this.doneByList) {
      return this.doneByList.length - i;
    } else {
      return 0;
    }
  }

  calcLeftDate() {
    if (this.doneByList && this.doneByList.length > 1) {
      return this.doneByList.length * 18 + 18 + 8 + 'px';
    } else if (this.doneByList && this.doneByList.length === 1) {
      return 36 + 8 + 'px';
    } else {
      return 0;
    }
  }

  ngOnDestroy() {
    // this.$reporters.unsubscribe();
  }
}
