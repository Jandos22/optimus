import { Injectable } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';

// rxjs
import { of } from 'rxjs';
import { take, switchMap, map } from 'rxjs/operators';

// services
import { ValidationService } from '../../../../../shared/validators/validation.service';
import { AsyncValidationService } from '../../../../../shared/validators/async-validation.service';
import { PeopleFormValueService } from './people-form-value.service';
import { PeopleFormPhotoService } from './people-form-photo.service';

// interfaces
import { PeopleItem } from '../../../../../shared/interface/people.model';
import { FormMode } from '../../../../../shared/interface/form.model';

@Injectable()
export class PeopleFormInitService {
  constructor(
    private fb: FormBuilder,
    private formValueService: PeopleFormValueService,
    private asyncValidators: AsyncValidationService,
    private photoService: PeopleFormPhotoService
  ) {}

  create_FormGroup_Fields(mode: FormMode, item: PeopleItem) {
    // create item via new class
    item = this.formValueService.createPeopleItemObject(mode, item);

    return this.fb.group({
      Name: new FormControl(
        this.getSimpleFormValue(mode, item, 'Name'),
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
      ),
      PositionId: [
        this.getSimpleFormValue(mode, item, 'PositionId'),
        Validators.required
      ]
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

  // get field value & condition
  getSimpleFormValue(mode: FormMode, item: PeopleItem, field: string) {
    switch (mode) {
      case 'new':
        return '';
      case 'view':
        return { value: item[field], disabled: true };
      case 'edit':
        return { value: item[field], disabled: false };
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
