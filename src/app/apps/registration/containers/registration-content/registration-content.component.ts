import { Component, Input } from '@angular/core';

// interfaces
import { SharepointUser } from '../../../../shared/interface/user.model';
import { LocationEnt } from '../../../../shared/interface/locations.model';

@Component({
  selector: 'app-registration-content',
  styleUrls: ['registration-content.component.scss'],
  template: `
    <app-new-user-form fxFlex fxLayout="row" fxLayoutAlign="center"
        [alias]="userSharepoint.username"
        [email]="userSharepoint.email"
        [locations]="locations">
    </app-new-user-form>
    `
})
export class RegistrationContentComponent {
  @Input() userSharepoint: SharepointUser;
  @Input() locations: LocationEnt[];

  constructor() {}
}
