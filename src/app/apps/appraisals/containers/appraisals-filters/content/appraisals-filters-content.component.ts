// core
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

// forms
import { FormGroup } from '@angular/forms';

// interfaces
import { PeopleItem } from '../../../../people/models/people-item.model';
import { AppraisalRights } from '../../../store';

// people group ids
import { people_fefs } from './../../../../../shared/constants/ids-fefs';
import { people_op } from '../../../../../shared/constants/ids-op';

@Component({
  selector: 'app-appraisals-filters-content',
  styleUrls: ['appraisals-filters-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-content-container">
        <app-filters-locations
            [fg_filters]="fg_filters" [locofinterest]="locofinterest"
            (updateLocationsofinterest)="updateLocationsofinterest.emit($event)">
        </app-filters-locations>

        <app-filters-people-single class=""
            fxLayout="row wrap"
            [fg_filters]="fg_filters" [displayName]="'Given For'" [selfUser]="selfUser"
            [includeOnly]="people_op" [default]="defaultGivenFor" [disabled]="disabledGivenFor"
            [reset]="reset"
            (onSelectUser)="onSelectGivenFor.emit($event)">
        </app-filters-people-single>

        <app-filters-people-single class=""
            fxLayout="row wrap"
            [fg_filters]="fg_filters" [displayName]="'Given By'" [selfUser]="selfUser"
            [includeOnly]="people_fefs" [default]="defaultGivenBy" [disabled]="disabledGivenBy"
            [reset]="reset"
            (onSelectUser)="onSelectGivenBy.emit($event)">
        </app-filters-people-single>

        <app-filters-date-range class=""
            fxLayout="row wrap" fxLayoutAlign="start start"
            [fg_filters]="fg_filters" [reset]="reset">
        </app-filters-date-range>

    </div>
    `
})
export class AppraisalsFiltersContentComponent {
  @Input()
  fg_filters: FormGroup;

  @Input()
  locofinterest: number[];

  @Input()
  selfUser: PeopleItem;

  @Input()
  position: AppraisalRights;

  @Input()
  reset: boolean;

  @Output()
  updateLocationsofinterest = new EventEmitter<number[]>();

  @Output()
  onSelectGivenBy = new EventEmitter<number>();

  @Output()
  onSelectGivenFor = new EventEmitter<number>();

  people_fefs = people_fefs;
  people_op = people_op;

  constructor() {}

  get defaultGivenBy() {
    // default user for GivenBy depends on user's position
    console.log('default given by');

    // if user belongs to FEFS team
    // then default GivenBy should be him/her
    // for other people no preselection needed
    if (this.position.isFEFS) {
      return this.selfUser;
    } else {
      return null;
    }
  }

  get disabledGivenBy() {
    // if user belongs to Reviewers team
    // then he/she can select anybody
    // other people cannot select GivenBy
    if (this.position.isReviewer) {
      return false;
    } else {
      return true;
    }
  }

  get defaultGivenFor() {
    // default user for GivenFor depends on user's position
    console.log('default GivenFor');

    // if user belongs to OP team
    // then default GivenFor should be him/her
    // for other people no preselection needed
    if (this.position.isOP) {
      return this.selfUser;
    } else {
      return null;
    }
  }

  get disabledGivenFor() {
    // if user belongs to Reviewers team
    // then he/she can select anybody
    // other people cannot select GivenBy
    if (this.position.isReviewer || this.position.isFEFS) {
      return false;
    } else {
      return true;
    }
  }
}
