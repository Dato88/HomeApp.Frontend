import { TodoDto } from '../../../../shared/_interfaces/todo/todo-dto';

export interface TodoState {
  entities: { [id: number]: TodoDto };
  ids: number[];
  isLoading: boolean;
  error: string | null;
}

export const initialTodoState: TodoState = {
  entities: {},
  ids: [],
  isLoading: false,
  error: null,
};
