import { Injectable } from '@angular/core';

// rxjs
import { of } from 'rxjs';

import {
  map,
  switchMap,
  mergeMap,
  catchError,
  withLatestFrom,
  skipUntil,
  skipWhile,
  skip
} from 'rxjs/operators';

// lodash
import * as _ from 'lodash';

// ngrx
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromRoot from '../../../../store';
import * as fromJobs from '..';
import * as fromErrorActions from '../../../../store/actions/errors.actions';

// services
import { JobsToolsService } from './../../services/jobs-tools.service';

// interfaces
import { ToolItem } from '../../../../shared/interface/tools.model';

@Injectable()
export class ToolNamesEffects {
  constructor(
    private store$: Store<fromRoot.RootState>,
    private actions$: Actions,
    private srv: JobsToolsService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  fetchToolNames$ = this.actions$.pipe(
    ofType(fromJobs.ToolNamesActionTypes.FETCH_TOOL_NAMES),
    switchMap(x => {
      return this.srv.getToolNames().pipe(
        map(toolNames => {
          toolNames = _.map(toolNames, (toolName: ToolItem) => {
            return { ...toolName, id: toolName.ID };
          });

          return new fromJobs.FetchToolNamesSuccess(toolNames);
        }),
        catchError(error => of(new fromErrorActions.DisplayError(error)))
      );
    })
  );
}
