import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';

// rxjs
import { take } from 'rxjs/operators';

// services
import { SearchUsersService } from '../../../services';

// interfaces
import { SearchParamsUser } from '../../../interface/people.model';
import { PeopleItem } from './../../../interface/people.model';

@Component({
  selector: 'app-fc-people-selector-single-fetch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``
})
export class FcPeopleSelectorSingleFetchComponent implements OnChanges {
  @Input() fetch: SearchParamsUser;

  @Output() onFetchSuccess = new EventEmitter<PeopleItem[]>();

  constructor(private srv: SearchUsersService) {}

  ngOnChanges(changes: SimpleChanges) {
    // watch changes of fetch input object
    if (changes.fetch) {
      // react if only fetch has value
      if (changes.fetch.currentValue) {
        this.fetchUsers(changes.fetch.currentValue);
      }
    }
  }

  fetchUsers(query: SearchParamsUser) {
    console.log('fetching users ...');
    console.log(query);

    // this.searching = true;
    const search$ = this.srv.searchUsers(query);

    search$
      .pipe(take(1))
      .subscribe(
        success => this.fetchUsersSuccess(success),
        error => this.fetchUsersError(error),
        () => console.log('fetch users completed')
      );
  }

  fetchUsersSuccess(success) {
    console.log(success);
    // this.searching = false;

    this.onFetchSuccess.emit(success);
  }

  fetchUsersError(error) {
    console.log(error);
    // this.searching = false;
  }
}
