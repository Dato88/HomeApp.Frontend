import { ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStoreFeature, type, withProps } from '@ngrx/signals';
import { map } from 'rxjs';
import { HouseholdService } from '../../services/household.service';
import { HouseholdResponse } from '../models';

export function withHouseholdQueries() {
  return signalStoreFeature(
    { props: type<{ _householdService: HouseholdService }>() },
    withProps((store) => ({
      householdsResource: rxResource({
        stream: () =>
          store._householdService
            .getHouseholds()
            .pipe(map((result) => (result.isSuccess ? result.value : []))),
      }) as ResourceRef<HouseholdResponse[]>,
    }))
  );
}
