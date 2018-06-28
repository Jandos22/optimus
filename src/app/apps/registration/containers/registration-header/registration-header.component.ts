import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-registration-header',
  styleUrls: ['registration-header.component.scss'],
  template: `
    <div class="container" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="8px"
        fxFlex.xs="100" fxFlex="400px">

        <!-- opens and closes sidenav -->
        <span class="common-button">
            <button mat-icon-button (click)="toggleSidenav.emit()" matTooltip="toggle apps list">
                <span class="fa_regular"><fa-icon [icon]="['fas', 'bars']"></fa-icon></span>
            </button>
        </span>

        <span>Self Registration</span>
    </div>
    `
})
export class RegistrationHeaderComponent {
  @Output() toggleSidenav = new EventEmitter<any>();

  constructor() {}
}
