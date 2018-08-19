import { FormMode } from './../../../../interface/form.model';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

// interfaces
import { PeopleItem } from '../../../../interface/people.model';

// services
import { UtilitiesService } from './../../../../services/utilities.service';

@Component({
  selector: 'app-people-selector-selected',
  styleUrls: ['people-selector-selected.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="people-selector-selected-container"
        fxLayout="row nowrap" fxLayoutAlign="space-between center" fxLayoutGap="8px"
        (mouseenter)="onMouseOverContainer()"
        (mouseleave)="onMouseLeaveContainer()"
        [ngClass]="{ 'overContainer': overContainer, 'overDelete': overDelete }">
        <div fxFlex="36px" class="people-selector-photo-container">
            <img class="photo" [src]="utils.userPhoto(user)">
        </div>
        <div fxFlex class="people-selector-user-info" fxLayout="column" fxLayoutAlign="center start">
            <!-- <div class="fullname">{{ user.Fullname}}</div> -->
            <div class="shortname">{{ user.Shortname}}</div>
            <div class="second_line" fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="4px">
                <span class="text">{{ user.LocationAssigned.Title }} &middot; {{ user.Position.Title}}</span>
                <div class="delete" *ngIf="mode !== 'view'"
                    matTooltip="unselect"
                    (mouseenter)="onMouseOverDelete()"
                    (mouseleave)="onMouseLeaveDelete()"
                    (click)="removeSelectedUser.emit(user.ID)">
                    <fa-icon [icon]="['fas', 'times']"></fa-icon>
                </div>
            </div>
        </div>
    </div>
    `
})
export class PeopleSelectorSelectedComponent {
  @Input()
  user: PeopleItem;

  @Input()
  mode: FormMode;

  @Output()
  removeSelectedUser = new EventEmitter<number>();

  overContainer: boolean;
  overDelete: boolean;

  constructor(public utils: UtilitiesService) {}

  onMouseOverContainer() {
    this.overContainer = true;
  }

  onMouseLeaveContainer() {
    this.overContainer = false;
  }

  onMouseOverDelete() {
    this.overDelete = true;
  }

  onMouseLeaveDelete() {
    this.overDelete = false;
  }
}
