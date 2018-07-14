import { FormMode } from './../../../../interface/form.model';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

// interfaces
import { PeopleItem } from '../../../../interface/people.model';

// services
import { UtilitiesService } from './../../../../services/utilities.service';

@Component({
  selector: 'app-user-selection-user-selected',
  styleUrls: ['user-selection-user-selected.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div fxFlex="36px" class="selectable-user-photo-container">
        <img [src]="utils.userPhoto(user)">
    </div>
    <div fxFlex class="selectable__user--info" fxLayout="column" fxLayoutAlign="center start">
        <span class="fullnameSelect" [id]="'user' + user.Id">{{ user.Fullname}}</span>
        <div class="second_line" fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="4px">
            <span>{{ user.LocationAssigned.Title }}</span>
            <span *ngIf="user.PositionId">&middot;</span>
            <span *ngIf="user.PositionId">{{ user.Position.Title}}</span>
        </div>
    </div>
    <div class='common-button'>
        <button *ngIf="mode !== 'view'" mat-icon-button matTooltip='Remove User' tabindex="-1"
            (click)="removeSelectedUser.emit(user.ID)">
            <span class='fa_regular'><fa-icon [icon]="['far', 'trash-alt']"></fa-icon></span>
        </button>
    </div>
    `
})
export class UserSelectionUserSelectedComponent {
  @Input() user: PeopleItem;
  @Input() mode: FormMode;

  @Output() removeSelectedUser = new EventEmitter<number>();

  constructor(public utils: UtilitiesService) {}
}
