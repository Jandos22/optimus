import { BatteriesFormSerialComponent } from "./batteries-form-serial/batteries-form-serial.component";
import { BatteriesFormHoursComponent } from "./batteries-form-hours/batteries-form-hours.component";
import { BatteriesFormPartNumberComponent } from "./batteries-form-pn/batteries-form-pn.component";
import { BatteriesFormStatusComponent } from "./batteries-form-status/batteries-form-status.component";
import { BatteriesFormDetailsComponent } from "./batteries-form-details/batteries-form-details.component";

export const forms_controls: any[] = [
  BatteriesFormSerialComponent,
  BatteriesFormHoursComponent,
  BatteriesFormPartNumberComponent,
  BatteriesFormStatusComponent,
  BatteriesFormDetailsComponent
];

export * from "./batteries-form-serial/batteries-form-serial.component";
export * from "./batteries-form-hours/batteries-form-hours.component";
export * from "./batteries-form-pn/batteries-form-pn.component";
export * from "./batteries-form-status/batteries-form-status.component";
export * from "./batteries-form-details/batteries-form-details.component";
