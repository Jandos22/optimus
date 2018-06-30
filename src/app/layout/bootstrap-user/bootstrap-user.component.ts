import { Component, Input } from '@angular/core';
import { BootstrapUser } from '../../shared/interface/user.model';

@Component({
  selector: 'app-bootstrap-user',
  styleUrls: ['bootstrap-user.component.scss'],
  template: `
    <div class="bootstrap__progress--stage">
        {{ userBootstrap.currentStage }}
    </div>

    <div class="bootstrap__progress--container">
        <mat-progress-bar mode="determinate" [value]="progress" color="primary">
        </mat-progress-bar>
    </div>
    `
})
export class BootstrapUserComponent {
  @Input() userBootstrap: BootstrapUser;

  constructor() {}

  get progress() {
    const stage = this.userBootstrap.currentStage;
    switch (stage) {
      case 'Retrieving Username ...':
        return 25;

      case 'Logged in as: ':
        return 50;

      case 'Looking for Optimus account ...':
        return 75;

      case 'Optimus account found ...':
        return 100;

      default:
        return 0;
    }
  }
}
