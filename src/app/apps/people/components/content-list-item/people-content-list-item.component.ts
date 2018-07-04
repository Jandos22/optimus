import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  SimpleChange,
  OnChanges
} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

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
        [@itemState]="itemState"
        (@itemState.start)="animationStarted($event)"
        (@itemState.done)="animationDone($event)"
        fxLayout="row" fxLayoutAlign="start center"
        [ngClass]="{ lastItem: last }">

        <div fxFlex="8px"></div>
        <div fxFlex="40px">
            <button mat-icon-button (click)="openUserForm.emit(item)">
                <span class="people-user-photo" fxLayout="column" fxLayoutAlign="center center">
                    <img *ngIf="item.Attachments" [src]="getPhotoUrl()">
                </span>
            </button>
        </div>
        <div fxFlex class="people-user-info" fxLayout="column" fxLayoutAlign="center start">
            <div *ngIf="item.Fullname" class="fullname">
                {{ item.Fullname}}
            </div>
            <div *ngIf="!item.Fullname" class="fullname">
                {{ item.Name }} {{ item.Surname }}
            </div>
            <div class="second-line" fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="4px">
                <span>{{ item.LocationAssigned?.Title }}</span>
                <span *ngIf="hasPosition()">&middot;</span>
                <span *ngIf="hasPosition()">{{ item.Position?.Title}}</span>
            </div>
        </div>
        <div fxFlex="40px" class='common-button'>
            <button mat-icon-button matTooltip='Open QUEST Certifications' (click)="openQuestCerts(item.Gin)">
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
    `,
  animations: [
    trigger('itemState', [
      state(
        'Existed',
        style({
          backgroundColor: '#fcfcfc'
        })
      ),
      state(
        'New',
        style({
          backgroundColor: '#c8e6c9'
        })
      ),
      transition('Existed => New', animate('1000ms ease-in')),
      transition('New => Existed', animate('1000ms ease-out'))
    ])
  ]
})
export class PeopleContentListItemComponent implements OnChanges {
  @Input() item: PeopleItem;
  @Input() last: boolean;

  // all items are initially "Existed"
  // check ngOnChanges
  itemState: 'Existed' | 'New' = 'Existed';
  animationsInitialized = false;

  // first animations triggers when itemState is set to 'Existed'
  // when new item arrive, then green/light-grey will blink 4 times
  counter = 5; // needs to be odd to end in Existed state

  @Output() openUserForm = new EventEmitter<PeopleItem>();

  constructor(private utils: UtilitiesService) {}

  getPhotoUrl() {
    // console.log(this.item.AttachmentFiles.results[0]);
    return this.utils.photoUrl(this.item.AttachmentFiles.results);
  }

  hasPosition() {
    return this.item.PositionId ? true : false;
  }

  openQuestCerts(Gin: string) {
    if (Gin) {
      window.open(
        `https://quest.slb.com/quest/Certifications/Rpts/MyTrainingRpt.asp?EmpNo=${Gin}`,
        '_blank'
      );
    }
  }

  // ***** ANIMATIONS LOGIC ***** //

  // * decrement counter each time animation started
  animationStarted(event) {
    --this.counter;
  }

  // * start toggling animations only if itemState
  // * switched from 'Existed' to 'New' in this.makeNew
  animationDone(event) {
    if (this.counter > 0 && this.animationsInitialized) {
      this.toggle();
    }
  }

  // * simply toogle 'New' and 'Existed'
  toggle() {
    this.itemState === 'New'
      ? (this.itemState = 'Existed')
      : (this.itemState = 'New');
  }

  // * triggered from ngOnChanges when item with 'New' property arrive
  makeNew() {
    this.itemState = 'New';
    this.animationsInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    // splice item for convenience and strong typing
    const currentItem: PeopleItem = changes.item.currentValue;

    // only when item has propery "New: true"
    // New: true is added duting InsertOneItem action
    if (currentItem && currentItem.New) {
      this.makeNew();
    }
  }
}
