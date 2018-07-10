import { NgModule } from '@angular/core';

// modules
import { MaterialModule } from '../../libraries/material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// components
import { FormControlUsersSelectionComponent } from './components/users-selection/fc-users-selection.component';
import { UsersSelectionUserOptionComponent } from './components/user-option/users-selection-user-option.component';
import { UsersSelectionUserSelectedComponent } from './components/user-selected/users-selection-user-selected.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FontAwesomeModule,
        ReactiveFormsModule
    ],
    declarations: [
        FormControlUsersSelectionComponent,
        UsersSelectionUserOptionComponent,
        UsersSelectionUserSelectedComponent
    ],
    exports: [
        FormControlUsersSelectionComponent,
        UsersSelectionUserOptionComponent,
        UsersSelectionUserSelectedComponent
    ],
    providers: []
})
export class FormControlUsersSelectionModule {}
