import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TodoDto } from '../../_interfaces/todo/todo-dto';

export const todoAdapter: EntityAdapter<TodoDto> = createEntityAdapter<TodoDto>({
  selectId: (todo) => todo.id,
});

export interface TodoState extends EntityState<TodoDto> {
  loading: boolean;
  error: string | null;
}

export const initialState: TodoState = todoAdapter.getInitialState({
  loading: false,
  error: null,
});
