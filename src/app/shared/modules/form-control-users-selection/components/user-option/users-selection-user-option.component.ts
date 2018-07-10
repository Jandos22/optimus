import { UtilitiesService } from './../../../../services/utilities.service';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { PeopleItem } from './../../../../interface/people.model';

@Component({
    selector: 'app-users-selection-user-option',
    styleUrls: ['users-selection-user-option.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div fxFlex="36px" class="selectable-user-photo-container">
      <img [src]="utils.userPhoto(user)">
    </div>
    <div fxFlex class="selectable__user--info" fxLayout="column" fxLayoutAlign="center start">
      <span class="fullnameSelect">{{ user.Fullname}}</span>
      <div class="second_line" fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="4px">
        <span>{{ user.LocationAssigned.Title }}</span>
        <span *ngIf="user.PositionId">&middot;</span>
        <span *ngIf="user.PositionId">{{ user.Position.Title}}</span>
      </div>
    </div>
    `
})
export class UsersSelectionUserOptionComponent {
    @Input() user: PeopleItem;

    constructor(public utils: UtilitiesService) {}
}
