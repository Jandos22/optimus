import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import * as _ from 'lodash';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-add-jobs-form-summary-section',
  styleUrls: ['add-jobs-form-summary-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [matTooltip]='getTooltip()'>
        <button mat-icon-button tabindex="-1"
            class="job-summary-button__add"
            [disabled]="!allSectionsValid || limitReached"
            (click)="onAddSection()">
            <span class='fa_regular'>
                <fa-icon [icon]="['fas', 'plus']"></fa-icon>
            </span>
        </button>
    <div>
    `
})
export class AddJobsFormSummarySectionComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  // total allowed number of job summary sections
  sectionsMax = 2;

  // total number of active (visible to user) sections
  sectionsActive = 1;

  constructor() {}

  get allSectionsValid() {
    const sectionsActive = this.fg_fields.controls['SummarySections'].value;
    // creates array of true or false values
    const sectionValidity = _.times(sectionsActive, (n: number) => {
      const section = n + 1;

      const title = this.fg_fields.controls['JSStitle' + section];
      const body = this.fg_fields.controls['JSSbody' + section];

      // check validity of nth section
      const valid = title.valid && body.valid ? true : false;
      // check if first section is empty
      const empty = title.value && body.value ? false : true;

      // if title and body are valid, and both are not empty
      // then return true, otherwise false
      return valid && !empty ? true : false;
    });

    // find false value, what means that one of sections is invalid or empty
    // returns false if found invalid value, otherwise undefined
    const result = _.find(sectionValidity, (validity: boolean) => {
      return validity === false;
    });

    // if result of validity check is false
    // then return false, otherwise all active sections are valid
    return result === false ? false : true;
  }

  get limitReached() {
    const sectionsActive = this.fg_fields.controls['SummarySections'].value;
    return sectionsActive === this.sectionsMax ? true : false;
  }

  onAddSection() {
    const sections = this.fg_fields.controls['SummarySections'];
    const initial = sections.value;

    if (initial < this.sectionsMax) {
      this.fg_fields.controls['SummarySections'].patchValue(initial + 1);
    } else {
      console.log('cannot exceed max sections: ' + this.sectionsMax);
    }
  }

  getTooltip() {
    if (!this.allSectionsValid) {
      return 'All Job Summary Sections must be valid';
    } else if (this.limitReached) {
      return `Job Summary Sections limit reached (${this.sectionsMax})`;
    } else {
      return 'Add Job Summary Section';
    }
  }
}
