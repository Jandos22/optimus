import { AbstractControl, ValidatorFn } from '@angular/forms';

export class ValidationService {
  static onlyNumbers(control: AbstractControl) {
    if (control.value === '') {
      return null;
    }
    const regex = /^[0-9]+$/i;
    const valid = regex.test(control.value);
    return valid ? null : { onlyNumbers: true };
  }
}
