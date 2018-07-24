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
import * as fromJobs from '../../../../store';

// ngrx actions
import * as fromErrorActions from '../../../../../../store/actions/errors.actions';
import * as fromJobsActions from '../../../../store/actions/jobs.actions';

// interfaces
import { JobItem } from '../../../../../../shared/interface/jobs.model';

// services
import { JobsFormHttpService } from '../../form-services/jobs-form-http.service';

@Component({
  selector: 'app-jobs-form-actions-new',
  styleUrls: ['jobs-form-actions-new.component.scss'],
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
export class JobsFormActionsNewComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;

  @Output() closeForm = new EventEmitter<any>();

  // activates spinner
  savingChanges = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_jobs: Store<fromJobs.JobsState>,
    private spHttp: JobsFormHttpService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  onSave() {
    this.savingChanges = true;
    this.saveFields(this.fg_fields.getRawValue());
  }

  saveFields(newFields: JobItem) {
    this.spHttp
      .createJob(newFields)
      .pipe(take(1))
      .subscribe(
        success => this.saveFieldsSuccess(success as JobItem),
        error => this.saveFieldsError(error),
        () => console.log('completed adding new job')
      );
  }

  saveFieldsSuccess(newJob: JobItem) {
    // add newly created job to jobs store
    console.log('get new job');
    console.log(newJob);
    this.spHttp
      .getItemById(newJob.ID)
      .pipe(take(1))
      .subscribe(
        success => this.getNewlyCreatedItemSuccess(success as JobItem[]),
        error => console.log(error),
        () => console.log('completed getting newly created item')
      );
  }

  getNewlyCreatedItemSuccess(newItemExpanded: JobItem[]) {
    console.log('get new item expanded');
    console.log(newItemExpanded);
    this.store_jobs.dispatch(
      new fromJobsActions.InsertOneJob({
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
    console.log(this.fg_fields);
    console.log(this.fg_fields.getRawValue());
  }
}
