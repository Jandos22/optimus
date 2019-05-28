import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from "@angular/core";

// interfaces
import { FormMode } from "../../../../../../shared/interface/form.model";
import { PeopleItem } from "../../../../../../shared/interface/people.model";

// ngrx
import { Store } from "@ngrx/store";
import * as fromPeople from "../../../../store";

import * as _ from "lodash";

// people groups
import { groupPsdmJdl } from "../../../../../../shared/constants/people-groups.const";

@Component({
  selector: "app-people-form-actions-view",
  styleUrls: ["people-form-actions-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-button
      tabindex="-1"
      color="primary"
      [disabled]="!canEdit"
      (click)="switchFormMode.emit('edit')"
    >
      EDIT
    </button>

    <button
      mat-button
      tabindex="-1"
      (click)="closeUserForm.emit()"
      class="people-form__btn--cancel"
    >
      CLOSE
    </button>
  `
})
export class PeopleFormActionsViewComponent {
  @Input() currentUser: PeopleItem;
  @Input() initialFields: PeopleItem;

  @Output() switchFormMode = new EventEmitter<FormMode>();

  @Output() closeUserForm = new EventEmitter();

  groupPsdmJdl = groupPsdmJdl;

  constructor(private store: Store<fromPeople.PeopleState>) {}

  // EDIT button is active
  // 1. If user is PSDM or JDL
  // 2. If user is him-her-self
  get canEdit() {
    const positionId = this.currentUser.PositionId;

    // check if current user is PSDM or JDL
    let isPSDMorJDL = _.find(groupPsdmJdl, id => id === positionId);

    let isSelf =
      this.initialFields.Alias === this.currentUser.Alias ? true : false;

    // console.log("canEdit");
    // console.log("positionId: " + positionId);
    // console.log("group:" + groupPsdmJdl);
    // console.log("res: " + res);

    return isPSDMorJDL || isSelf ? true : false;
  }
}
