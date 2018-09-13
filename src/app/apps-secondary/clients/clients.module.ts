import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../shared/libraries/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// entry components
import { ClientsCreateNewClientComponent } from './create-new-client/clients-create-new-client.component';

/*
    Clients Module's goal is to
    - add/remove/edit oil/gas clients
    - (later) view all clients and get necessary info
    - (later) view current weather and forecast of clients

    Client Module interact with users via
    - quick dialog box
    - (later) via own Clients AppPage
*/

@NgModule({
  imports: [CommonModule, MaterialModule, FontAwesomeModule],
  exports: [ClientsCreateNewClientComponent],
  declarations: [ClientsCreateNewClientComponent],
  providers: [],
  entryComponents: [ClientsCreateNewClientComponent]
})
export class ClientsModule {}
