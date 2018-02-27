import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'people-list-item',
  styleUrls: ['people-list-item.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <mat-list-item>
        <img matListAvatar [src]="user.Photo?.Url" [alt]="user.Photo?.Description">
        
            <h3 matLine>{{ user.Name }} {{ user.Surname }}</h3>
            <a matLine [href]="'mailto:' + user.Email" class="emailLink">{{ user.Email }}</a>
        
        <mat-divider [inset]="false" *ngIf="!last"></mat-divider>
    <mat-list-item>
    `
})
export class PeopleListItemComponent {
  @Input() user: any;
  @Input() last: boolean;
  constructor() {}
}
