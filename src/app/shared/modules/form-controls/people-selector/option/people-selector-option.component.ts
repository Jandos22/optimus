import { UtilitiesService } from './../../../../services/utilities.service';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

import { PeopleItem } from './../../../../interface/people.model';

@Component({
  selector: 'app-people-selector-option',
  styleUrls: ['people-selector-option.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="people-selector-option-container"
      fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="8px">
      <div fxFlex="36px" class="people-selector-photo-container">
        <img class="photo" [src]="utils.userPhoto(user)">
      </div>
      <div fxFlex class="people-selector-user-info" fxLayout="column" fxLayoutAlign="center start">
        <div class="shortname">{{ user.Shortname}}</div>
        <div class="second_line" fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="4px">
          <span class="text">{{ user.LocationAssigned.Title }} &middot; {{ user.Position.Title}}</span>
        </div>
      </div>
    </div>
    `
})
export class PeopleSelectorOptionComponent {
  @Input() user: PeopleItem;

  constructor(public utils: UtilitiesService) {}
}
