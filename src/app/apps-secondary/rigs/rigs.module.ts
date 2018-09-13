import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../shared/libraries/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// entry components
import { RigsCreateNewRigComponent } from './create-new-rig/rigs-create-new-rig.component';

/*
    Rigs Module's goal is to
    - add/remove/edit oil/gas rigs
    - (later) view all rigs and get necessary info
    - (later) view current weather and forecast of rigs

    Rig Module interact with users via
    - quick dialog box
    - (later) via own Rigs AppPage
*/

@NgModule({
  imports: [CommonModule, MaterialModule, FontAwesomeModule],
  exports: [RigsCreateNewRigComponent],
  declarations: [RigsCreateNewRigComponent],
  providers: [],
  entryComponents: [RigsCreateNewRigComponent]
})
export class RigsModule {}
