import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { MaterialModule } from './../../libraries/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImageCropperModule } from 'ngx-img-cropper';
import { MaterialDesignComponentsModule } from './../../libraries/material-design-components.module';

// services
import { FormControlImagePickerService } from './services/form-control-image-picker.service';
import { FormControlImagePickerComponent } from './containers/form-control-image-picker/form-control-image-picker.component';

// components

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    MaterialDesignComponentsModule,
    ImageCropperModule
  ],
  declarations: [FormControlImagePickerComponent],
  entryComponents: [FormControlImagePickerComponent],
  exports: [FormControlImagePickerComponent],
  providers: [FormControlImagePickerService]
})
export class FormControlImagePickerModule {}
