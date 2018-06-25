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

  static onlySearchable(control: AbstractControl) {
    if (control.value === '') {
      return null;
    }
    const regex = /^[a-z0-9#_\-]+$/i;
    const valid = regex.test(control.value);
    return valid ? null : { onlySearchable: true };
  }
}

// ^    : start of string
// [    : beginning of character group
// a-z  : any lowercase letter
// A-Z  : any uppercase letter
// 0-9  : any digit
// _    : underscore
// ]    : end of character group
// *    : zero or more of the given characters
// +    : one or more times (change to * to allow empty string)
// $    : end of string
// /i   : case-insensitive
