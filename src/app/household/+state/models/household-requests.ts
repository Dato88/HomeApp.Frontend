export interface CreateHouseholdRequest {
  name: string;
}

export interface RenameHouseholdRequest {
  householdId: number;
  name: string;
}

/** Invite either by email or by personId. */
export interface AddHouseholdMemberRequest {
  householdId: number;
  email?: string;
  personId?: number;
}

export interface RemoveHouseholdMemberRequest {
  householdId: number;
  personId: number;
}
