import { Injectable } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';

// rxjs
import { of } from 'rxjs';
import { take, switchMap, map } from 'rxjs/operators';

// services
import { ValidationService } from '../../../../../validators/validation.service';
import { AsyncValidationService } from '../../../../../validators/async-validation.service';
import { PeopleFormValueService } from './people-form-value.service';
import { PeopleFormPhotoService } from './people-form-photo.service';

// interfaces
import { PeopleItem } from '../../../../../shared/interface/people.model';
import { FormMode } from '../../../../../shared/interface/form.model';

@Injectable()
export class PeopleFormInitService {
  constructor(
    private formValueService: PeopleFormValueService,
    private asyncValidators: AsyncValidationService,
    private photoService: PeopleFormPhotoService
  ) {}

  create_FormGroup_Fields(mode: FormMode, item: PeopleItem) {
    item = this.formValueService.createPeopleItemObject(mode, item);
    return new FormGroup({
      Name: new FormControl(
        this.formValueService.initFieldValue(mode, item.Name),
        Validators.required
      ),
      Surname: new FormControl(
        this.formValueService.initFieldValue(mode, item.Surname),
        Validators.required
      ),
      Alias: new FormControl(
        this.formValueService.initDisabledFieldValue(mode, item.Alias),
        Validators.required,
        this.uniqueAlias.bind(this)
      ),
      Email: new FormControl(
        this.formValueService.initEmailValue(mode, item.Email),
        Validators.required
      ),
      Gin: new FormControl(
        this.formValueService.initDisabledFieldValue(mode, item.Gin),
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          ValidationService.onlyNumbers
        ],
        this.uniqueGin.bind(this)
      ),
      LocationAssignedId: new FormControl(
        this.formValueService.initFieldValue(mode, item.LocationAssignedId),
        Validators.required
      )
    });
  }

  create_FormGroup_Photo(mode: FormMode, item?: PeopleItem) {
    console.log(mode);
    if (mode === 'new') {
      return new FormGroup({
        ID: new FormControl(''),
        Filename: new FormControl(''),
        PhotoUrl: new FormControl(this.photoService.getNoPhotoUrl()),
        ArrayBuffer: new FormControl(new ArrayBuffer(0))
      });
    } else {
      return new FormGroup({
        ID: new FormControl(item.ID),
        Filename: new FormControl(this.photoService.getFileName(item)),
        PhotoUrl: new FormControl(this.photoService.getPhotoUrl(item)),
        ArrayBuffer: new FormControl(new ArrayBuffer(0))
      });
    }
  }

  // async validators

  // takes 'alias' => checks database => return form error or null
  // I couldn't integrate debounce time, now it just cancels http calls when typing
  uniqueAlias(control: AbstractControl) {
    return of(control.value).pipe(
      take(1),
      switchMap((alias: string) => {
        return this.asyncValidators.checkAliasUnique(alias);
      }),
      map((response: boolean) => {
        return response ? null : { uniqueAlias: true };
      })
    );
  }

  uniqueGin(control: AbstractControl) {
    return of(control.value).pipe(
      take(1),
      switchMap((gin: number) => {
        return this.asyncValidators.checkGinUnique(gin);
      }),
      map((response: boolean) => {
        return response ? null : { unique: true };
      })
    );
  }
}
