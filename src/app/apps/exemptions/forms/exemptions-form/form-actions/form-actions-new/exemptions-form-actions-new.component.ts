import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../store';
import * as fromExemptions from '../../../../store';

// ngrx actions
import * as fromErrorActions from '../../../../../../store/actions/errors.actions';
import * as fromExemptionsActions from '../../../../store/actions/exemptions.actions';

// interfaces
import { ExemptionItem } from '../../../../../../shared/interface/exemptions.model';

// services
import { ExemptionsFormHttpService } from '../../form-services/exemptions-form-http.service';

@Component({
  selector: 'app-exemptions-form-actions-new',
  styleUrls: ['exemptions-form-actions-new.component.scss'],
  template: `
    <button mat-button color="primary" (click)="log()">LOG</button>

    <button mat-button color="primary"
      [disabled]="!fg_fields.valid || savingChanges"
      (click)="onSave()">
      <span *ngIf="!savingChanges">SAVE</span>
      <span *ngIf="savingChanges">SAVING </span>
      <fa-icon *ngIf="savingChanges" [icon]="['fas', 'spinner']" [spin]="true" matTooltip="Saving changes"></fa-icon>
    </button>

    <button mat-button tabindex="-1"
      (click)="closeForm.emit()">
      CANCEL
    </button>
    `
})
export class ExemptionsFormActionsNewComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;

  @Output() closeForm = new EventEmitter<any>();

  // activates spinner
  savingChanges = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_exemptions: Store<fromExemptions.ExemptionsState>,
    private spHttp: ExemptionsFormHttpService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  onSave() {
    this.savingChanges = true;
    this.saveFields(this.fg_fields.getRawValue());
  }

  saveFields(newFields: ExemptionItem) {
    this.spHttp
      .createExemption(newFields)
      .pipe(take(1))
      .subscribe(
        success => this.saveFieldsSuccess(success as ExemptionItem),
        error => this.saveFieldsError(error),
        () => console.log('completed adding new user')
      );
  }

  saveFieldsSuccess(newExemption: ExemptionItem) {
    // add newly created user to users store
    // update fg_photo by adding ID of created user
    // check if form has unsaved photo and upload it
    // if no unsaved photo, then close form
    console.log('get new user');
    console.log(newExemption);
    this.spHttp
      .getItemById(newExemption.ID)
      .pipe(take(1))
      .subscribe(
        success => this.getNewlyCreatedItemSuccess(success as ExemptionItem[]),
        error => console.log(error),
        () => console.log('completed getting newly created item')
      );
  }

  getNewlyCreatedItemSuccess(newItemExpanded: ExemptionItem[]) {
    console.log('get new item expanded');
    console.log(newItemExpanded);
    this.store_exemptions.dispatch(
      new fromExemptionsActions.InsertOneExemption({
        ...newItemExpanded[0],
        id: newItemExpanded[0].ID
      })
    );
    this.finalize();
  }

  saveFieldsError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  finalize() {
    console.log(this.fg_fields.value);
    this.savingChanges = false;
    this.closeForm.emit({
      result: 'success',
      data: this.fg_fields.value
    });
  }

  log() {
    console.log(this.fg_fields.getRawValue());
  }
}
