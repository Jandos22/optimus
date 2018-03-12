import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-people-top-select',
  styleUrls: ['people-top-select.component.css'],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="selectTop">
      {{ top }}<mat-icon>keyboard_arrow_down</mat-icon>
    </button>
    <mat-menu #selectTop="matMenu">
      <button mat-menu-item *ngFor="let item of topOptions" (click)="onSelect(item)">
        <span>{{ item }}</span>
      </button>
    </mat-menu>
  `
})
export class PeopleTopSelectComponent implements OnInit {
  @Input() top: number;

  topOptions = [5, 10, 25, 50, 100];

  @Output() onSelectTop = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  onSelect(top) {
    console.log(top);
    this.onSelectTop.emit(top);
  }
}
