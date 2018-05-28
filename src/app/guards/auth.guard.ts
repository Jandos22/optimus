import { Injectable, OnDestroy } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

// rxjs 6
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromRoot from '../store';
import * as userActions from '../store/actions/user.actions';
import * as a_in_app from '../store/actions/app.actions';

import { UserService } from '../services/user.service';

// interfaces
import { CurrentUser } from './../models/current-user.m';

@Injectable()
export class AuthGuard implements OnDestroy {
  isRegistered$: Subscription;
  isRegistered: boolean;

  constructor(
    private router: Router,
    private store: Store<fromRoot.RootState>,
    private userService: UserService
  ) {
    // subscribe to Store and listen to isRegistered
    // when user navigates to other apps isRegistered already available
    this.isRegistered$ = this.store
      .select(fromRoot.getIsRegistered)
      .subscribe(next => {
        this.isRegistered = next;
      });
  }

  // every time any high level route activated
  // it goes through CanActivate check
  // on first load "isRegistered" will be null
  // so checkRegistration() activated
  canActivate() {
    console.log('is registered?: ' + this.isRegistered);
    return this.isRegistered ? true : this.checkRegistration();
  }

  // first, get current SP user and write it in Store
  // then, take alias and check NgPeople for registration
  // if registered, then take user info and write in Store
  // if not registered, then navigate to Registration page
  checkRegistration() {
    console.log('checkRegistration');
    return this.userService
      .getLoggedInUser()
      .toPromise()
      .then((loggedInUser: CurrentUser) => {
        // console.log(loggedInUser);
        const user = this.userService.prepCurrentUserObject(loggedInUser);
        this.store.dispatch(new userActions.SetCurrentUser(user));
        return user.username;
      })
      .then(alias => {
        console.log('checkUser');
        return this.userService
          .checkLoggedInUserRegistered(alias)
          .toPromise()
          .then((response: any) => {
            // if no user found in NgPeople
            // then response.value will be empty
            const data = response.value[0];
            return data
              ? this.userIsRegistered(data)
              : this.navigateToRegistration();
          });
      });
  }

  navigateToRegistration() {
    console.log('navigate to registration');
    this.store.dispatch(new userActions.SetUserNotRegistered(false));
    this.router.navigate(['/registration']);
  }

  userIsRegistered(optimusUser) {
    const payload = this.userService.prepOptimusUserObject(optimusUser);
    this.store.dispatch(new userActions.SetOptimusUser(payload));
    this.store.dispatch(new a_in_app.SetSelectedLocation(payload.location));
    return true;
  }

  ngOnDestroy() {
    this.isRegistered$.unsubscribe();
  }
}
