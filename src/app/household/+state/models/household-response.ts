import { HouseholdMemberDto } from './household-member-dto';

export interface HouseholdResponse {
  householdId: number;
  name: string;
  members: HouseholdMemberDto[];
}
