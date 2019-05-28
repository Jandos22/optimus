import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  SimpleChanges,
  OnDestroy
} from "@angular/core";

// rxjs
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";

// services
import { PeopleLookupService } from "../../../../shared/services";

// interfaces
import { PeopleItem } from "../../../../shared/interface/people.model";

// date-fns
// import * as differenceInDays from 'date-fns/difference_in_days';
import * as distanceInWords from "date-fns/distance_in_words";
// import * as startOfToday from 'date-fns/start_of_today';

@Component({
  selector: "app-battery-last-updated",
  templateUrl: "./battery-last-updated.component.html",
  styleUrls: ["./battery-last-updated.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatteryLastUpdatedComponent implements OnInit, OnDestroy {
  @Input() lastUpdatedById: number;

  @Input() lastUpdatedDate: Date;

  $lastUpdatedById: Subscription;

  lastUpdatedPerson: PeopleItem;

  constructor(
    private srv: PeopleLookupService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lastUpdatedById && changes.lastUpdatedById.currentValue) {
      this.handleInput(changes.lastUpdatedById.currentValue);
    }
  }

  get lastUpdatedStatement() {
    if (this.lastUpdatedPerson) {
      const distance = distanceInWords(Date.now(), this.lastUpdatedDate);
      const who = this.lastUpdatedPerson.Fullname;
      return "last updated " + distance + " ago by " + who;
    } else {
      return "working...";
    }
  }

  handleInput(lastUpdatedById: number) {
    this.$lastUpdatedById = this.srv
      .getUserById(lastUpdatedById)
      .pipe(take(1))
      .subscribe((lastUpdatedAll: PeopleItem[]) => {
        this.lastUpdatedPerson = { ...lastUpdatedAll[0] };
        this.cd.detectChanges();
      });
  }

  ngOnDestroy() {
    this.$lastUpdatedById.unsubscribe();
  }
}
