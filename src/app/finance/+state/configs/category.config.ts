import { type } from '@ngrx/signals';
import { entityConfig } from '@ngrx/signals/entities';
import { CategoryDto } from '../models';

export const categoryEntities = entityConfig({
  entity: type<CategoryDto>(),
  collection: 'category',
  selectId: (category) => category.categoryId,
});
