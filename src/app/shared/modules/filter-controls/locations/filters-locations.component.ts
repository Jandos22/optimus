import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";

// forms
import { FormGroup, FormControl } from "@angular/forms";

import * as _ from "lodash";

// rxjs
import { Subscription } from "rxjs";
import { take, tap, startWith } from "rxjs/operators";

// interfaces
import { LocationEnt } from "../../../../shared/interface/locations.model";

// services
import { LocationsService } from "../../../../shared/services/locations.service";

@Component({
  selector: "app-filters-locations",
  styleUrls: ["filters-locations.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_filters">
      <mat-select placeholder="Locations" formControlName="locations" multiple>
        <mat-option
          *ngFor="let item of locations | filterLocations: exclude"
          [value]="item.Id"
          [disabled]="optionDisabled && thisId(item.Id)"
        >
          {{ item.Title }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `
})
export class FiltersLocationsComponent implements OnInit {
  @Input()
  fg_filters: FormGroup;

  @Input()
  locofinterest: number;

  @Input()
  exclude: string[];

  @Output()
  updateLocationsofinterest = new EventEmitter<number[]>();

  // fc_locations = new FormControl([])
  locations: LocationEnt[] = [];

  $fetch: Subscription;
  fetching: boolean;

  // watch form control
  $fc_locations: Subscription;
  optionDisabled: boolean;

  constructor(private srv: LocationsService, private cd: ChangeDetectorRef) {
    this.fetch();
  }

  ngOnInit() {
    this.$fc_locations = this.fg_filters.controls["locations"].valueChanges
      .pipe(
        tap(locations => this.updateLocationsofinterest.emit(locations)),
        startWith(this.fg_filters.controls["locations"].value)
      )
      .subscribe((selected: number[]) => {
        this.onlyOneLocationLeftSelected(selected);
      });
  }

  onlyOneLocationLeftSelected(selected: number[]) {
    this.optionDisabled = selected && selected.length === 1 ? true : false;
    this.cd.detectChanges();
  }

  thisId(Id: number) {
    return Id === this.fg_filters.controls["locations"].value[0] ? true : false;
  }

  fetch() {
    this.fetching = true;

    this.$fetch = this.srv
      .getLocations()
      .pipe(
        take(1)
        // tap(v => console.log(v))
      )
      .subscribe(success => this.fetchSuccess(success as LocationEnt[]));
  }

  fetchSuccess(locations: LocationEnt[]) {
    this.fetching = false;
    this.locations = [...locations];
    this.cd.detectChanges();
  }

  fetchError(error) {
    console.log(error);
    this.fetching = false;
    this.locations = [];
    this.cd.detectChanges();
  }

  updateFcLocations(locations: number[]) {
    this.fg_filters.controls["locations"].patchValue(locations);
  }
}
