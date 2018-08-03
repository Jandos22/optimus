import { AppraisalSkillItem } from './../../../../../../shared/interface/appraisals.model';
import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-appraisals-form-proactivity',
  styleUrls: ['appraisals-form-proactivity.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="appraisals-skill-container" fxLayout="row wrap" FxLayoutAlign="start start">

      <div class="appraisals-row-main" fxLayout="row nowrap" fxLayoutAlign="space-between center">

        <div fxFlex class="skill-title"><fa-icon [icon]="['fas', 'info-circle']" [matTooltip]="description"></fa-icon> Proactivity</div>

        <button mat-icon-button matTooltip='Outstanding' color="primary" *ngIf="skillValue === 'A'">
          <span class='fa_regular'><fa-icon [icon]="['fas', 'star']"></fa-icon></span>
        </button>

        <button mat-button [matMenuTriggerFor]="menu" [color]="color"
          class="skill-value-button" [disabled]="mode === 'view'"
          [ngClass]="{
            A: skillValue === 'A',
            B: skillValue === 'B',
            C: skillValue === 'C',
            D: skillValue === 'D'
          }">
          {{ skillValue }}
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item class="appraisal-btn" *ngFor="let option of options"
            fxLayout="row nowrap" fxLayoutAlign="start center"
            (click)="onSelectValue(option)">
            <button mat-icon-button>{{ option.value }}</button>
            <div class="appraisal-option-description-container">
              <div class="description">{{ option.description }}</div>
            </div>
          </button>
        </mat-menu>

      </div>

    </div>

    <mat-form-field fxFlex="100" [formGroup]="fg_fields" class="appraisal-description-container">
        <textarea matInput
          formControlName="ProactivityDetails"
          cdkTextareaAutosize
          #autosize="cdkTextareaAutosize"
          cdkAutosizeMinRows="1"
          cdkAutosizeMaxRows="4">
        </textarea>
        <mat-hint align="end" *ngIf="mode !== 'view' && !isEmpty && !isDisabled">
          {{ fg_fields.controls[skillDescription].value?.length }} / 255
        </mat-hint>
        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class AppraisalsFormProactivityComponent implements OnInit, OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  skill = 'Proactivity';
  skillDescription = 'ProactivityDetails';

  // this is a default validator for details field
  detailsValidators = [Validators.required, Validators.maxLength(255)];
  detailsMinMaxOnly = [
    Validators.required,
    Validators.minLength(22),
    Validators.maxLength(255)
  ];

  $react2changes: Subscription;

  description =
    'the ability to choose what to do and when without being prompted by another person';

  hint4a = 'please provide details on what was outstanding';
  hint4d = 'please provide details on what needs development';

  options: AppraisalSkillItem[] = [
    { value: 'A', selected: false, description: 'Outstanding' },
    {
      value: 'B',
      selected: false,
      description: 'Will work efficiently with no prompting'
    },
    {
      value: 'C',
      selected: false,
      description: 'Good work (maybe need some prompting)'
    },
    { value: 'D', selected: false, description: 'Development needed' }
  ];

  // selection button color
  color = 'primary';

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // form mode changes
    if (changes.mode.currentValue) {
      this.onModeChange(changes.mode.currentValue);
    }
  }

  onModeChange(mode: FormMode) {
    if (mode === 'new') {
      // set default values for Skill Value and Description
      this.fg_fields.controls[this.skill].patchValue(this.options[2].value);
      this.fg_fields.controls[this.skillDescription].patchValue(
        this.options[2].description
      );

      // enable subscriptions
      this.startSubscriptions();
    }
  }

  get isEmpty() {
    const value = this.fg_fields.controls[this.skillDescription].value;
    return value ? false : true;
  }

  get isDisabled() {
    return this.fg_fields.controls[this.skillDescription].disabled;
  }

  get hasError() {
    return this.fg_fields.controls[this.skillDescription].invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls[this.skillDescription];

    const required = control.hasError('required');
    const min = control.hasError('minlength');
    const max = control.hasError('maxlength');
    const need4a = control.hasError('need4a');
    const need4d = control.hasError('need4d');

    return control.touched
      ? required
        ? '... is required'
        : min
          ? 'minimum 22 characters required'
          : max
            ? 'maximum 255 characters allowed'
            : need4a
              ? this.hint4a
              : need4d
                ? this.hint4d
                : ''
      : '';
  }

  get skillValue() {
    const value = this.fg_fields.controls[this.skill].value;
    return value ? value : 'C';
  }

  startSubscriptions() {
    // watch changes of Skill Value and enable form only when
    // A or D is selected and mode is edit
    this.$react2changes = this.fg_fields.controls[this.skill].valueChanges
      .pipe(startWith(this.fg_fields.controls[this.skill].value))
      .subscribe(value => {
        console.log(value);

        if (this.mode === 'view') {
          // disable form control as it already have description
          this.fg_fields.controls[this.skillDescription].disable();
        } else if (value === 'A' || value === 'D') {
          console.log('A or D');
          // disable form control as it already have description
          this.fg_fields.controls[this.skillDescription].enable();
        } else if (value === 'B' || value === 'C') {
          console.log('B or C');
          // disable form control as it already have description
          this.fg_fields.controls[this.skillDescription].disable();
        }
      });
  }

  // activated when button pressed in template
  onSelectValue(option: AppraisalSkillItem) {
    // when value selected then anyway update skill
    this.fg_fields.controls[this.skill].patchValue(option.value);

    if (option.value === 'C' || option.value === 'B') {
      // B and C have details, so simply write them up
      this.fg_fields.controls[this.skillDescription].patchValue(
        option.description
      );
      // reset default validators
      this.fg_fields.controls[this.skillDescription].setValidators(
        this.detailsValidators
      );
    } else if (option.value === 'A' || option.value === 'D') {
      // clear any content from skill details
      this.fg_fields.controls[this.skillDescription].patchValue('');

      // add additional validator for min length if A or D is selected
      this.fg_fields.controls[this.skillDescription].setValidators(
        this.detailsMinMaxOnly
      );

      if (option.value === 'A') {
        // set error that A need details
        this.fg_fields.controls[this.skillDescription].setErrors({
          need4a: true
        });
        // also mark as touched, so that error message appear instantly
        this.fg_fields.controls[this.skillDescription].markAsTouched();
      }

      if (option.value === 'D') {
        // set error that D need details
        this.fg_fields.controls[this.skillDescription].setErrors({
          need4d: true
        });
        // also mark as touched, so that error message appear instantly
        this.fg_fields.controls[this.skillDescription].markAsTouched();
      }
    }
  }

  onAorDselect(option: AppraisalSkillItem) {
    this.fg_fields.controls[this.skill].patchValue(option.value);
    this.fg_fields.controls[this.skillDescription].patchValue(
      option.description
    );
  }
}
