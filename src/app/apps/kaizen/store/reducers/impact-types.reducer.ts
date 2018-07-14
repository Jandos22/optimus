// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  ImpactTypesActionTypes,
  ImpactTypesActionsUnion
} from '../actions/impact-types.actions';

// interfaces
import { KaizenImpactType } from '../../../../shared/interface/kaizen.model';

// compose reducer state shape here
export interface ImpactTypesState extends EntityState<KaizenImpactType> {
  applicable: KaizenImpactType[];
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<KaizenImpactType> = createEntityAdapter<
  KaizenImpactType
>({});

// compose initial state here
export const initialState: ImpactTypesState = adapter.getInitialState({
  applicable: [],
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: ImpactTypesActionsUnion
): ImpactTypesState {
  switch (action.type) {
    case ImpactTypesActionTypes.FETCH_IMPACT_TYPES: {
      return { ...state, searching: true };
    }

    case ImpactTypesActionTypes.FETCH_IMPACT_TYPES_SUCCESS: {
      const adapted = adapter.addAll(action.impactTypes, state);
      return { ...adapted, searching: false };
    }

    case ImpactTypesActionTypes.FILTERING_APPLICABLE_IMPACT_TYPES_SUCCESS: {
      return { ...state, applicable: action.applicableImpactTypes };
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectImpactTypesIds,
  selectEntities: selectImpactTypesEntities,
  selectAll: selectAllImpactTypes,
  selectTotal: selectImpactTypesTotal
} = adapter.getSelectors();

export const getImpactTypesSearching = (state: ImpactTypesState) =>
  state.searching;
export const getApplicableImpactTypes = (state: ImpactTypesState) =>
  state.applicable;
