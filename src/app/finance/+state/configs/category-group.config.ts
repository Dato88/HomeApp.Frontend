import { type } from '@ngrx/signals';
import { entityConfig } from '@ngrx/signals/entities';
import { CategoryGroupDto } from '../models';

export const categoryGroupEntities = entityConfig({
  entity: type<CategoryGroupDto>(),
  collection: 'categoryGroup',
  selectId: (categoryGroup) => categoryGroup.categoryGroupId,
});
