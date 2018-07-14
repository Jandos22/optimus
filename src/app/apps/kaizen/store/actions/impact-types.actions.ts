import { Action } from '@ngrx/store';

import { KaizenImpactType } from '../../../../shared/interface/kaizen.model';

export enum ImpactTypesActionTypes {
  FETCH_IMPACT_TYPES = '[Kaizen Projects] Fetch Impact',
  FETCH_IMPACT_TYPES_SUCCESS = '[Kaizen Projects] Fetch Project Impact Success',
  FILTERING_APPLICABLE_IMPACT_TYPES_SUCCESS = '[Kaizen Projects] Filtering Applicable Project Impact Success'
}

export class FetchImpactTypes implements Action {
  readonly type = ImpactTypesActionTypes.FETCH_IMPACT_TYPES;
}

export class FetchImpactTypesSuccess implements Action {
  readonly type = ImpactTypesActionTypes.FETCH_IMPACT_TYPES_SUCCESS;
  constructor(public impactTypes: KaizenImpactType[]) {}
}

export class FilteringApplicableImpactTypesSuccess implements Action {
  readonly type =
    ImpactTypesActionTypes.FILTERING_APPLICABLE_IMPACT_TYPES_SUCCESS;
  constructor(public applicableImpactTypes: KaizenImpactType[]) {}
}

export type ImpactTypesActionsUnion =
  | FetchImpactTypes
  | FetchImpactTypesSuccess
  | FilteringApplicableImpactTypesSuccess;
