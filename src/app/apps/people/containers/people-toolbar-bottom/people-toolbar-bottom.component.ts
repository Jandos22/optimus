import { Component } from '@angular/core';

@Component({
  selector: 'app-people-toolbar-bottom',
  styleUrls: ['people-toolbar-bottom.component.css'],
  template: `
    <mat-toolbar-row class="toolbarForPaging">
      <div fxLayout="row" fxLayoutAlign="space-between center" fxFlexFill>
        <button mat-icon-button>
          <mat-icon>navigate_before</mat-icon>
        </button>
        <div>Center</div>
        <button mat-icon-button>
          <mat-icon>navigate_next</mat-icon>
        </button>
      </div>
    </mat-toolbar-row>
  `
})
export class PeopleToolbarBottomComponent {
  constructor() {}
}
