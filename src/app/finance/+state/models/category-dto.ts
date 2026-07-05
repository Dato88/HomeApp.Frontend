import { CategoryType } from './category-type.enum';

export interface CategoryDto {
  categoryId: number;
  householdId: number;
  name: string;
  categoryType: CategoryType;
}
