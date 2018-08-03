import { AppraisalGroupItem } from './../../../../shared/interface/appraisals.model';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// interfaces
import { AppraisalItem } from '../../../../shared/interface/appraisals.model';

@Component({
  selector: 'app-appraisal-group',
  styleUrls: ['appraisal-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="appraisal-group-container">

      <div class="job-container" fxLayout="row nowrap" fxLayoutAlign="space-between start">
        <div class="job-date">{{ job.RigUpStart | date: 'mediumDate' }}</div>
        <div class="job-title">{{ job.Well }} | {{ job.Title }}</div>
      </div>

      <div class="appraisal-item-container" *ngFor="let appraisal of job.appraisals"
        fxLayout="row wrap" fxLayoutAlign="start start"
        (click)="openForm.emit(appraisal)">

        <div class="given-for" fxFlex="100%" fxFlex.gt-xs="180px">
          <app-appraisal-given-for [viewPerson]="appraisal.GivenFor"></app-appraisal-given-for>
        </div>

        <div class="scores" fxFlex fxLayout="row wrap" fxLayoutAlign="start start">

          <!-- KEY FACTORS -->
          <div class="key-factors" fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="4px">

            <div class="section-title">Key Factors</div>

            <div [ngClass]="['key-factor', appraisal.Safety]" [matTooltip]="appraisal.SafetyDetails">
              <div class="score" *ngIf="appraisal.Safety !== 'A'">{{ appraisal.Safety }}</div>
              <div class="score" *ngIf="appraisal.Safety === 'A'" [ngClass]="{'A': (appraisal.Safety === 'A')}">
                <fa-icon [icon]="['fas', 'star']"></fa-icon>
              </div>
              <div class="factor" [ngClass]="{'A': (appraisal.Safety === 'A')}">safety</div>
            </div>

            <div [ngClass]="['key-factor', appraisal.Proactivity]" [matTooltip]="appraisal.ProactivityDetails">
              <div class="score" *ngIf="appraisal.Proactivity !== 'A'">{{ appraisal.Proactivity }}</div>
              <div class="score" *ngIf="appraisal.Proactivity === 'A'" [ngClass]="{'A': (appraisal.Proactivity === 'A')}">
                <fa-icon [icon]="['fas', 'star']"></fa-icon>
              </div>
              <div class="factor" [ngClass]="{'A': (appraisal.Proactivity === 'A')}">proact.</div>
            </div>

            <div [ngClass]="['key-factor', appraisal.Quality]" [matTooltip]="appraisal.QualityDetails">
              <div class="score" *ngIf="appraisal.Quality !== 'A'">{{ appraisal.Quality }}</div>
              <div class="score" *ngIf="appraisal.Quality === 'A'" [ngClass]="{'A': (appraisal.Quality === 'A')}">
                <fa-icon [icon]="['fas', 'star']"></fa-icon>
              </div>
              <div class="factor" [ngClass]="{'A': (appraisal.Quality === 'A')}">quality</div>
            </div>

            <div [ngClass]="['key-factor', appraisal.WinchDriving]" [matTooltip]="appraisal.WinchDrivingDetails">
              <div class="score" *ngIf="appraisal.WinchDriving !== 'A'">{{ appraisal.WinchDriving }}</div>
              <div class="score" *ngIf="appraisal.WinchDriving === 'A'" [ngClass]="{'A': (appraisal.WinchDriving === 'A')}">
                <fa-icon [icon]="['fas', 'star']"></fa-icon>
              </div>
              <div class="factor" [ngClass]="{'A': (appraisal.QualWinchDrivingity === 'A')}">winch</div>
            </div>

          </div>

          <!-- KEY SKILLS -->
          <div class="key-skills" fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="4px">

            <div class="section-title">Key Skills</div>

            <div class="key-skill" [ngClass]="{'did': appraisal.DidRopeSocket}" [matTooltip]="'Prepared RopeSocket (Standard)'"
              *ngIf="appraisal.DidRopeSocket">
              <div class="top">did</div>
              <div class="skill">RS</div>
            </div>

            <div class="key-skill" [ngClass]="{'did': appraisal.DidRopeSocketH2S}" [matTooltip]="'Prepared RopeSocket (H2S)'"
              *ngIf="appraisal.DidRopeSocketH2S">
              <div class="top">did</div>
              <div class="skill">RS</div>
            </div>

            <div class="key-skill" [ngClass]="{'did': appraisal.DidHead}" [matTooltip]="'Prepared Logging Head'"
              *ngIf="appraisal.DidHead">
              <div class="top">did</div>
              <div class="skill">HD</div>
            </div>

            <div class="key-skill" [ngClass]="{'did': appraisal.DidCollector}" [matTooltip]="'Prepared Collector'"
              *ngIf="appraisal.DidCollector">
              <div class="top">did</div>
              <div class="skill">COL</div>
            </div>

          </div>

          <!-- Overall Performance -->
          <div class="comments-container" fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="4px">
            <div class="section-title">Overall Performance</div>
            <div class="comments">{{ appraisal.OverallPerformance }}</div>
          </div>

          <!-- Further Development-->
          <div class="comments-container" fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="4px">
            <div class="section-title">Further Development</div>
            <div class="comments">{{ appraisal.FurtherDevelopment }}</div>
          </div>

          <!-- Operator's Comments-->
          <div class="comments-container" fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="4px">
            <div class="section-title">Operators Comments</div>
            <div class="comments"></div>
          </div>

          <!-- Appraisal By -->
          <div class="appraisal-by" fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="4px">
            <div class="section-title">Appraisal By</div>
            <div class="engineer">{{ appraisal.GivenBy.Shortname }}</div>
          </div>

        </div>

      </div>
    </div>
    `
})
export class AppraisalGroupComponent {
  @Input() job: AppraisalGroupItem;
  @Input() last: boolean;

  @Output() openForm = new EventEmitter<AppraisalItem>();

  constructor() {}
}
