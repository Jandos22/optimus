import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormMode } from '../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-kaizen-form-value-creation',
  styleUrls: ['kaizen-form-value-creation.component.scss'],
  template: `
    <div fxFlex="100" class="cmn-form-control-title" style="margin-bottom: 0px;">
      Value Creation:
    </div>
    <div fxFlex="100" class="kaizen-value-creation-field">
        <mat-checkbox [formControl]="valueCreation"
            color="primary"
            [disabled]="mode === 'view'"
            class="kaizen-value-creation-text">
            Value creation for client
        </mat-checkbox>
    </div>
    `
})
export class KaizenFormValueCreationComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  valueCreation = new FormControl('');

  $mapping: Subscription;

  constructor() {}

  ngOnInit() {
    this.valueCreation.setValue(
      this.getBoolean(this.fg_fields.controls['ValueCreationForClient'].value)
    );

    this.$mapping = this.valueCreation.valueChanges
      .pipe(
        map(value => {
          return value === true ? 'true' : 'false';
        })
      )
      .subscribe(value => {
        console.log(value);
        this.fg_fields.controls['ValueCreationForClient'].setValue(value);
      });
  }

  getBoolean(value: string) {
    return value === 'true' ? true : false;
  }

  ngOnDestroy() {
    this.$mapping.unsubscribe();
  }
}
