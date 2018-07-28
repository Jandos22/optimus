import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import { FormControl, Validators } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-jobs-form-summary-section-dynamic-validation',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobsFormSummarySectionDynamicValidationComponent
  implements OnInit, OnDestroy {
  @Input() title: FormControl;
  @Input() body: FormControl;

  // watch value changes and react
  $title: Subscription;
  $body: Subscription;

  // default validators
  titleValidators = [Validators.maxLength(70)];
  bodyValidators = [Validators.maxLength(255)];

  constructor() {}

  ngOnInit() {
    // if job summary title has value then its sibling body is required
    this.$title = this.title.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(value => {
        console.log(value);
        if (value) {
          this.body.setValidators([
            ...this.bodyValidators,
            Validators.required
          ]);
          this.body.updateValueAndValidity();
        } else {
          this.body.setValidators([...this.bodyValidators]);
          this.body.updateValueAndValidity();
        }
      });

    // if job summary body has value then its sibling title is required
    this.$body = this.body.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(value => {
        console.log(value);
        if (value) {
          this.title.setValidators([
            ...this.titleValidators,
            Validators.required
          ]);
          this.title.updateValueAndValidity();
        } else {
          this.title.setValidators([...this.titleValidators]);
          this.title.updateValueAndValidity();
        }
      });
  }

  ngOnDestroy() {
    this.$body.unsubscribe();
    this.$title.unsubscribe();
  }
}
