import { inject, isDevMode } from '@angular/core';
import { signalStore, signalStoreFeature, withProps, withState } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withErrorHandling } from '../../+store/features/with-error.feature';
import { HouseholdService } from '../services/household.service';
import { householdEntities } from './configs/household.config';
import { withHouseholdQueries } from './features/with-household-queries.feature';
import { withHouseholdEntitySync } from './features/with-household-entity-sync.feature';
import { withHouseholdCommands } from './features/with-household-commands.feature';

export interface HouseholdState {
  isSaving: boolean;
}

const householdStoreFeatures = [
  withState<HouseholdState>({ isSaving: false }),
  withProps(() => ({ _householdService: inject(HouseholdService) })),
  withEntities(householdEntities),
  withErrorHandling(),
  withHouseholdQueries(),
  withHouseholdEntitySync(),
  withHouseholdCommands(),
] as const;

const devtoolsFeature = isDevMode()
  ? withDevtools('households')
  : signalStoreFeature(withState({}));

export const HouseholdStore = signalStore(
  { providedIn: 'root' },
  ...householdStoreFeatures,
  devtoolsFeature
);
