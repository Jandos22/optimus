import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as fromPipes from './pipes';

@NgModule({
  declarations: [
    ...fromPipes.pipes
  ],
  exports: [...fromPipes.pipes]
})
export class SharedModule {}
