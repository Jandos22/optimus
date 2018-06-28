import { Component } from '@angular/core';

@Component({
  selector: 'app-registration-footer',
  styleUrls: ['registration-footer.component.scss'],
  template: `
    <div class="registration__footer--container" fxLayout="row" fxLayoutAlign="center center" fxLayoutGap="4px">
        <span>Optimization Suite</span>
        <span>&middot;</span>
        <span>Wireline</span>
    </div>
    `
})
export class RegistrationFooterComponent {
  constructor() {}
}
