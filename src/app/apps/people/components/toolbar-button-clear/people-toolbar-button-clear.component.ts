import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-toolbar-button-clear',
  styleUrls: ['people-toolbar-button-clear.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="common-button warn"
        [ngClass]="{ warn: fg_params.get('text').invalid }">
        <button mat-icon-button [matTooltip]="errorMessage()"
            (click)="fg_params.get('text').patchValue('')">
            <span class="fa_regular"><fa-icon [icon]="['fas', 'times']"></fa-icon></span>
        </button>
    </div>
    `
})
export class PeopleToolbarButtonClearComponent {
  @Input()
  fg_params: FormGroup;

  constructor() {}

  errorMessage() {
    const control = this.fg_params.controls['text'];

    const onlySearchable = control.hasError('onlySearchable');

    return control.dirty
      ? onlySearchable
        ? 'Only letters, numbers and #, -, _ are allowed'
        : ''
      : '';
  }
}
