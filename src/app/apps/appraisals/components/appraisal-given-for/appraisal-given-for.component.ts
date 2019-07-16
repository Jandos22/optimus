import {
  Component,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// constants
import { SlbSpPath } from '../../../../shared/constants';

// interfaces
import { FormMode } from '../../../../shared/interface/form.model';
import { PeopleItem } from '../../../../shared/interface/people.model';

// services
import { UtilitiesService } from './../../../../shared/services/utilities.service';
import { PeopleLookupService } from './../../../../shared/services/people-lookup.service';

@Component({
  selector: 'app-appraisal-given-for',
  styleUrls: ['appraisal-given-for.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="person-container"
      fxLayout="row nowrap"
      fxLayoutAlign="space-between center"
      fxLayout.gt-xs="row wrap"
      fxLayoutAlign.gt-xs="start start"
    >
      <div
        class="person-photo-container"
        fxFlex="36px"
        fxFlex.gt-xs="180px"
        fxFlexOrder.gt-xs="3"
        fxLayout.gt-xs="row wrap"
        fxLayoutAlign.gt-xs="start end"
      >
        <img
          class="photo"
          [src]="photo"
          [matTooltip]="fullname"
          matTooltipClass="mytooltip large-text"
        />
      </div>

      <div
        class="person-info"
        fxLayout="column"
        fxLayoutAlign="center start"
        fxFlex
        fxFlex.gt-xs="124px"
        fxFlexOrder.gt-xs="2"
      >
        <div class="shortname">{{ viewPerson.Shortname }}</div>
        <div
          class="secondary"
          fxLayout="row nowrap"
          fxLayoutAlign="start center"
          fxLayoutGap="4px"
        >
          <span class="text"
            >{{ ($person | async)?.LocationAssigned?.Title }} &middot;
            {{ ($person | async)?.Position?.Title }}</span
          >
        </div>
      </div>

      <div class="button-to-quest" fxFlexOrder.gt-xs="1">
        <button
          mat-icon-button
          matTooltip="Open QUEST Certifications"
          (click)="openQuestCerts(gin)"
        >
          <span class="fa_regular"
            ><fa-icon [icon]="['fas', 'user-graduate']"></fa-icon
          ></span>
        </button>
      </div>
    </div>
  `
})
export class AppraisalGivenForComponent implements OnChanges {
  @Input() viewPerson: PeopleItem;

  $person = new Subject<PeopleItem>();

  photo = 'assets/no_user.png';
  gin: string;
  fullname: string;

  constructor(
    private utils: UtilitiesService,
    private lookup: PeopleLookupService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // react when viewPerson input changes
    if (changes.viewPerson.currentValue) {
      // check if current value has Id
      const current: PeopleItem = changes.viewPerson.currentValue;
      if (current.Id) {
        // if has, then can fetch full people item object
        this.fetchPerson(current.Id);
      } else {
        console.log('current person has no id');
        console.log(current);
      }
    }
  }

  fetchPerson(Id: number) {
    // a one time subscription
    const $fetch = this.lookup.getUserById(Id);
    // fetch person using Id
    $fetch
      .pipe(take(1))
      .subscribe(person => this.fetchPersonSuccess(person as PeopleItem[]));
  }

  fetchPersonSuccess(person: PeopleItem[]) {
    this.$person.next({ ...person[0] });
    this.photo = this.userPhoto(person[0]);
    this.gin = person[0].Gin;
    this.fullname = person[0].Fullname;
    // console.log(person);
    // this.cd.detectChanges();
  }

  userPhoto(user: PeopleItem) {
    if (user.Attachments) {
      if (user.AttachmentFiles.results) {
        return SlbSpPath + user.AttachmentFiles.results[0].ServerRelativeUrl;
      } else {
        return 'assets/no_user.png';
      }
    } else {
      return 'assets/no_user.png';
    }
  }

  openQuestCerts(Gin: string) {
    if (Gin) {
      window.open(
        `https://quest.slb.com/quest/Certifications/Rpts/MyTrainingRpt.asp?EmpNo=${Gin}`,
        '_blank'
      );
    }
  }
}
