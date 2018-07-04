import { Component } from '@angular/core';

@Component({
  selector: 'app-people-toolbar-button-filters',
  styleUrls: ['people-toolbar-button-filters.component.scss'],
  template: `
    <div class="common-button">
        <button mat-icon-button matTooltip="Choose filters">
            <span class="fa_regular"><fa-icon [icon]="['fas', 'filter']"></fa-icon></span>
        </button>
    </div>
    `
})
export class PeopleToolbarButtonFiltersComponent {
  constructor() {}
}
