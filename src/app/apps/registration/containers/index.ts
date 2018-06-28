import { RegistrationComponent } from './registration/registration.component';
import { RegistrationHeaderComponent } from './registration-header/registration-header.component';
import { RegistrationFooterComponent } from './registration-footer/registration-footer.component';
import { RegistrationContentComponent } from './registration-content/registration-content.component';

export const containers: any[] = [
  RegistrationComponent,
  RegistrationHeaderComponent,
  RegistrationContentComponent,
  RegistrationFooterComponent
];

export * from './registration/registration.component';
export * from './registration-header/registration-header.component';
export * from './registration-footer/registration-footer.component';
export * from './registration-content/registration-content.component';
