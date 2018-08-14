import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../libraries/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// components
import { ToolbarButtonAddComponent } from './components/toolbar-button-add/toolbar-button-add.component';
import { ToolbarButtonClearComponent } from './components/toolbar-button-clear/toolbar-button-clear.component';
import { ToolbarButtonFiltersComponent } from './components/toolbar-button-filters/toolbar-button-filters.component';
import { ToolbarButtonMenuComponent } from './components/toolbar-button-menu/toolbar-button-menu.component';
import { ToolbarInputSearchComponent } from './components/toolbar-input-search/toolbar-input-search.component';
import { ToolbarButtonSaveComponent } from './components/toolbar-button-save/toolbar-button-save.component';

const components: any[] = [
  ToolbarButtonAddComponent,
  ToolbarButtonClearComponent,
  ToolbarButtonFiltersComponent,
  ToolbarButtonMenuComponent,
  ToolbarInputSearchComponent,
  ToolbarButtonSaveComponent
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  declarations: [...components],
  exports: [...components],
  providers: []
})
export class ToolbarButtonsModule {}
