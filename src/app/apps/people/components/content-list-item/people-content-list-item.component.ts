import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

// services
import { UtilitiesService } from './../../../../shared/services/utilities.service';

// interfaces
import { PeopleItem } from './../../../../shared/interface/people.model';

@Component({
  selector: 'app-people-content-list-item',
  styleUrls: ['people-content-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="common-list-item"
        fxLayout="row" fxLayoutAlign="start center"
        [ngClass]="{ lastItem: last }">

        <div fxFlex="8px"></div>
        <div fxFlex="40px">
            <button mat-icon-button>
                <span class="people-user-photo" fxLayout="column" fxLayoutAlign="center center">
                    <img *ngIf="item.Attachments" [src]="getPhotoUrl()">
                </span>
            </button>
        </div>
        <div fxFlex class="people-user-info" fxLayout="column" fxLayoutAlign="center start">
            <div class="fullname">
                {{ item.Fullname}}
            </div>
            <div class="second-line" fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="4px">
                <span>{{ item.LocationAssigned.Title }}</span>
                <span *ngIf="hasPosition()">&middot;</span>
                <span *ngIf="hasPosition()">{{ item.Position.Title}}</span>
            </div>
        </div>
        <div fxFlex="40px" class='common-button'>
            <button mat-icon-button matTooltip='Open QUEST Certifications'>
                <span class='fa_regular'><fa-icon [icon]="['fas', 'user-graduate']"></fa-icon></span>
            </button>
        </div>
        <div fxFlex="40px" class='common-button'>
            <button mat-icon-button>
                <span class='fa_regular'><fa-icon [icon]="['fas', 'ellipsis-v']"></fa-icon></span>
            </button>
        </div>
        <div fxFlex="4px"></div>
    </div>
    `
})
export class PeopleContentListItemComponent {
  @Input() item: PeopleItem;
  @Input() last: boolean;

  constructor(private utils: UtilitiesService) {}

  getPhotoUrl() {
    // console.log(this.item.AttachmentFiles.results[0]);
    return this.utils.photoUrl(this.item.AttachmentFiles.results);
  }

  hasPosition() {
    return this.item.PositionId ? true : false;
  }
}
