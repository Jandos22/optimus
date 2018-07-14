import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

// interfaces
import { KaizenProjectItem } from '../../../../shared/interface/kaizen.model';

@Component({
  selector: 'app-kaizen-projects-list',
  styleUrls: ['kaizen-projects-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="kaizen-projects-list--container" fxFlex
      fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="16px">

      <app-kaizen-project *ngFor="let project of projects; last as last" [project]="project"
        [ngClass]="{ 'project-last': last }"
        (openForm)="openForm.emit($event)">
      </app-kaizen-project>

    </div>
    `
})
export class KaizenProjectsListComponent {
  @Input() projects: KaizenProjectItem[];

  @Output() openForm = new EventEmitter<KaizenProjectItem>();

  constructor() {}
}
