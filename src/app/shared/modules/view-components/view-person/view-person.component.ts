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
import { SlbSpPath } from './../../../constants/index';

// interfaces
import { FormMode } from '../../../interface/form.model';
import { PeopleItem } from '../../../interface/people.model';

// services
import { UtilitiesService } from './../../../services/utilities.service';
import { PeopleLookupService } from './../../../services/people-lookup.service';

@Component({
  selector: 'app-view-person',
  styleUrls: ['view-person.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="person-container" fxLayout="row nowrap" fxLayoutAlign="space-between center" fxLayoutGap="8px">
        <div fxFlex="36px" class="person-photo-container">
            <img class="photo" [src]="photo">
        </div>
        <div fxFlex class="person-info" fxLayout="column" fxLayoutAlign="center start">
            <!-- <div class="fullname">{{ person.Fullname}}</div> -->
            <div class="shortname">{{ viewPerson.Shortname}}</div>
            <div class="secondary" fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="4px">
                <span class="text">{{ ($person | async)?.LocationAssigned?.Title }} &middot; {{ ($person | async)?.Position?.Title}}</span>
            </div>
        </div>
    </div>
    `
})
export class ViewPersonComponent implements OnChanges {
  @Input() viewPerson: PeopleItem;

  $person = new Subject<PeopleItem>();

  photo = 'assets/no_user.png';

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
    $fetch.pipe(take(1)).subscribe(person => this.fetchPersonSuccess(person));
  }

  fetchPersonSuccess(person: PeopleItem) {
    this.$person.next({ ...person[0] });
    this.photo = this.userPhoto(person[0]);
    console.log(person);
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
}
