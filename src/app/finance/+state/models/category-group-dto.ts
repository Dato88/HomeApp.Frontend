import { CategoryType } from './category-type.enum';

export interface CategoryGroupDto {
  categoryGroupId: number;
  householdId: number;
  name: string;
  categoryGroupType: CategoryType;
  /** Ziel-Anteil am Einkommen in Prozent (z. B. 30), null = kein Ziel. */
  targetPercent: number | null;
}
