import { effect, ResourceRef } from '@angular/core';
import { patchState, signalStoreFeature, type, withHooks } from '@ngrx/signals';
import { setAllEntities } from '@ngrx/signals/entities';
import { HouseholdResponse } from '../models';
import { householdEntities } from '../configs/household.config';

export function withHouseholdEntitySync() {
  return signalStoreFeature(
    { props: type<{ householdsResource: ResourceRef<HouseholdResponse[]> }>() },
    withHooks({
      onInit(store) {
        effect(() => {
          const resource = store.householdsResource;
          if (resource.hasValue()) {
            patchState(store, setAllEntities(resource.value(), householdEntities));
          }
        });
      },
    })
  );
}
