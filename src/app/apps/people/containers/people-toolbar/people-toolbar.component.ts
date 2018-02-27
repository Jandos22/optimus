import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-toolbar',
  styleUrls: ['people-toolbar.component.css'],
  template: `
    <mat-toolbar>
        <mat-toolbar-row>
        
        
            <span>
                <button mat-icon-button>
                    <mat-icon>add</mat-icon>
                </button>
            </span>
        
            <app-people-search
                [parent]="peopleFiltersForm">
            </app-people-search>

        </mat-toolbar-row>
    </mat-toolbar>
    `
})
export class PeopleToolbarComponent {
  peopleFiltersForm = new FormGroup({
    search: new FormGroup({
      query: new FormControl(''),
      location: new FormControl('')
    })
  });
  constructor() {
    this.peopleFiltersForm
      .get('search')
      .get('query')
      .valueChanges.subscribe(next => {
        console.log(next);
      });
  }
}
