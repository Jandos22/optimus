import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

import * as _ from 'lodash';

// constants
import { ApiPath, PathSlbSp } from '../../../../shared/constants';

// interfaces
import { KaizenProjectItem } from '../../../../shared/interface/kaizen.model';

@Component({
  selector: 'app-kaizen-project',
  styleUrls: ['kaizen-project.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <mdc-card class="kaizenproject-card__container">
        <div fxLayout="column" fxLayout.gt-xs="row">

            <mdc-card-media fxFlex="200px" fxFlex.gt-xs="200px"
              [square]="true" *ngIf="project.Attachments"
              [ngStyle]="{ 'background-image': 'url(' + imageUrl + ')'}">
            </mdc-card-media>

            <div fxLayout="column" fxLayoutAlign="start"
              [ngClass]="(project.Attachments ? 'kaizenproject-card__hasimage' : 'kaizenproject-card__noimage')">

              <div class='kaizen-project-impact-type' fxLayout="row nowrap">

                <span
                  class='project-type'
                  *ngFor="let type of project?.ProjectType?.results"
                  [matTooltip]="getProjectTypeTooltip(type.Title)">
                  {{ type.Title }}
                </span>

                <span
                  class='value-creation'
                  *ngIf="getValueCreation()"
                  matTooltip="Value creation for client">
                  <fa-icon [icon]="['fas', 'check-circle']"></fa-icon>
                </span>

                <span class='star' *ngFor="let star of getStarsArray()">
                  <fa-icon [icon]="['fas', 'star']"></fa-icon>
                </span>

                <span class="impact-type">
                  {{ project.ImpactType.Title }}
                </span>
              </div>

                <div class="kaizenproject__title" (click)="openForm.emit(project)">
                  {{ project.Title }}
                </div>

                <div class="kaizenproject__summary" (click)="openForm.emit(project)">
                  {{ project.Summary }}
                </div>

                <div class="kaizen-project-quest" *ngIf="project.QuestRIR">
                  <span>QUEST: </span>
                  <span
                    [matTooltip]="getQuestTooltip()"
                    (click)="openQuestRIR()"
                    [ngClass]="{ hasQPID: checkQPID() }">
                    {{ project.QuestRIR }}
                  </span>
                </div>

                <div fxFlex></div>

                <app-kaizen-done-by
                  class="kaizenproject-card__reporters--container"
                    [doneBy]="project?.DoneBy?.results" [projectDate]="project?.ProjectDate">
                </app-kaizen-done-by>
            </div>

        </div>

        <app-locations-card
          class="locations-card"
          [locations]="project?.Locations?.results">
        </app-locations-card>
    </mdc-card>
    `
})
export class KaizenProjectComponent {
  @Input()
  project: KaizenProjectItem;

  @Output()
  openForm = new EventEmitter<KaizenProjectItem>();

  constructor() {}

  get imageUrl() {
    let path = '';
    if (this.project.Attachments) {
      path = this.project.AttachmentFiles.results[0].ServerRelativeUrl;
    }
    return ApiPath.startsWith('_') ? `${PathSlbSp}`.concat(path) : path;
  }

  checkQPID() {
    return this.project.QuestQPID ? true : false;
  }

  openQuestRIR() {
    const qpid = this.project.QuestQPID;
    if (qpid) {
      window.open(
        `https://quest.slb.com/quest/RIR/RIRview.asp?QPID=${qpid}`,
        '_blank'
      );
    }
  }

  getQuestTooltip() {
    if (this.project.QuestQPID) {
      return 'Open QUEST RIR';
    } else {
      return `QPID is missing, can't open QUEST RIR`;
    }
  }

  getProjectTypeTooltip(type) {
    switch (type) {
      case 'SQ':
        return 'Service Quality improvement';

      case 'HSE':
        return 'Health, Safety & Environment improvement';

      default:
        return 'Other Improvements';
    }
  }

  getStarsArray() {
    switch (this.project.ImpactType.Title) {
      case 'Small Improvement':
        return _.fill(Array(1), 1);

      case 'Medium Improvement':
        return _.fill(Array(2), 2);

      case 'Major Improvement':
        return _.fill(Array(3), 3);

      default:
        return [];
    }
  }

  getValueCreation() {
    return this.project.ValueCreationForClient === 'true' ? true : false;
  }

  withOrwithoutPhoto() {
    return this.project.Attachments
      ? 'kaizenproject-card__withphoto'
      : 'kaizenproject-card__nophoto';
  }
}
