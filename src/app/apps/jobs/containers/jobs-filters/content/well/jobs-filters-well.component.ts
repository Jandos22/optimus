import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

// forms
import { FormGroup, FormControl } from '@angular/forms';

import * as _ from 'lodash';

// rxjs
import { Subscription } from 'rxjs';
import {
  take,
  tap,
  pairwise,
  debounceTime,
  startWith,
  distinctUntilChanged
} from 'rxjs/operators';

@Component({
  selector: 'app-jobs-filters-well',
  styleUrls: ['jobs-filters-well.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_filters">

      <input
        matInput
        placeholder="Well"
        formControlName="well"
        autocomplete="off">

    </mat-form-field>
    `
})
export class JobsFiltersWellComponent implements OnInit {
  @Input() fg_filters: FormGroup;

  constructor() {}

  ngOnInit() {}
}
