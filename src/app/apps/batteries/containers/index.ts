import { BatteriesComponent } from "./batteries/batteries.component";
import { BatteriesHeaderComponent } from "./batteries-header/batteries-header.component";
import { BatteriesToolbarComponent } from "./batteries-toolbar/batteries-toolbar.component";
import { BatteriesFooterComponent } from "./batteries-footer/batteries-footer.component";
import { BatteriesListComponent } from "./batteries-list/batteries-list.component";

export const containers: any[] = [
  BatteriesComponent,
  BatteriesHeaderComponent,
  BatteriesToolbarComponent,
  BatteriesFooterComponent,
  BatteriesListComponent
];

export * from "./batteries/batteries.component";
export * from "./batteries-header/batteries-header.component";
export * from "./batteries-toolbar/batteries-toolbar.component";
export * from "./batteries-footer/batteries-footer.component";
export * from "./batteries-list/batteries-list.component";
