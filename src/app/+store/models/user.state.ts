import { PersonDto } from '../../shared/_interfaces/person/person-dto';

export interface UserState {
  isLoading: boolean;
  user: PersonDto;
}

export const initialUserState: UserState = {
  isLoading: false,
  user: {} as PersonDto,
};
