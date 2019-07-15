import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy,
  OnChanges,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatAutocompleteSelectedEvent
} from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RigsService } from '../../../../../../apps-secondary/rigs/services/rigs.service';
import { RigItem } from '../../../../../../shared/interface/rigs.model';
import {
  startWith,
  debounceTime,
  switchMap,
  distinctUntilChanged,
  filter,
  tap
} from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-jobs-filters-rigs',
  templateUrl: './jobs-filters-rigs.component.html',
  styleUrls: ['./jobs-filters-rigs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobsFiltersRigsComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  fg_filters: FormGroup;

  @ViewChild(MatAutocomplete)
  matAutocomplete: MatAutocomplete;

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

  // local variables

  fg: FormGroup;
  rigs: RigItem[];
  searching: boolean;

  $search: Subscription;
  $rigId: Subscription;

  constructor(
    private fb: FormBuilder,
    private srv: RigsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.createFormGroup();

    // subscriptions
    this.subscribeToTextSearch();
    this.subscribeToRigId();
  }

  createFormGroup() {
    // used to look-up for rig names
    this.fg = this.fb.group({
      text: { value: '', disabled: false }
    });
  }

  subscribeToTextSearch() {
    // search rigs
    this.$search = this.fg.controls['text'].valueChanges
      .pipe(
        startWith(''),
        debounceTime(600),
        switchMap((text: string | RigItem) => {
          console.log(text);
          if (typeof text === 'string') {
            return this.srv.getRigs(text);
          } else if (typeof text === 'object') {
            return this.srv.getRigs(text.Title);
          } else if (typeof text === 'undefined') {
            return this.srv.getRigs('');
          }
        })
      )
      .subscribe(
        (rigs: RigItem[]) => this.searchSuccess(rigs),
        error => this.searchError(error),
        () => console.log('rigs search subscription completed')
      );
  }

  subscribeToRigId() {
    this.$rigId = this.fg_filters.controls['rigId'].valueChanges
      .pipe(
        distinctUntilChanged(),
        filter(val => val === '')
      )
      .subscribe(() => {
        this.fg.controls['text'].patchValue('');
      });
  }

  searchSuccess(rigs: RigItem[]) {
    this.searching = false;
    this.rigs = rigs;
    this.cd.detectChanges();
  }

  searchError(error) {
    console.log(error);
    this.searching = false;
    this.rigs = [];
    this.cd.detectChanges();
  }

  onRigSelect(event: MatAutocompleteSelectedEvent) {
    const rig: RigItem = event.option.value;

    // user selected rig from list
    if (rig) {
      // update parent fg_fields
      this.fg_filters.controls['rigId'].patchValue(rig.Id);
    }
  }

  unselectRigsId() {
    this.fg_filters.controls['rigId'].patchValue('');
  }

  reset() {
    this.fg_filters.controls['rigId'].reset();
    this.fg.controls['text'].patchValue('');
  }

  displayFn(rig?: RigItem) {
    // when mode is view then show rig name
    if (!rig) {
      return '';
    } else if (rig) {
      return rig.Title;
    } else {
      return '';
    }
  }

  get hasError() {
    return this.fg_filters.get('rigId').invalid;
  }

  get errorMessage() {
    // const required = this.fg_fields.controls['RigId'].hasError('required');

    // if (required) {
    //   this.fg.controls['text'].setErrors({ required: true });
    // } else {
    //   this.fg.controls['text'].setErrors({});
    // }

    // return required ? 'field must be selected' : '';
    return '';
  }
  ngOnChanges() {}

  ngOnDestroy() {
    if (this.$search) {
      this.$search.unsubscribe();
    }
    this.$rigId.unsubscribe();
  }
}
