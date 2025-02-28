import { TodoDto } from '../todo/todo-dto';

export interface TodoState {
  entities: { [id: number]: TodoDto };
  ids: number[];
  loading: boolean;
  error: string | null;
}

export const initialState: TodoState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
};
