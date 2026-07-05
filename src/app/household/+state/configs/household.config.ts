import { type } from '@ngrx/signals';
import { entityConfig } from '@ngrx/signals/entities';
import { HouseholdResponse } from '../models';

export const householdEntities = entityConfig({
  entity: type<HouseholdResponse>(),
  collection: 'household',
  selectId: (household) => household.householdId,
});
