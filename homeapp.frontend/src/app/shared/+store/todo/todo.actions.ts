import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { TodoDto } from '../../_interfaces/todo/todo-dto';

export const TodoActions = createActionGroup({
  source: 'Todo',
  events: {
    'Load Todos': emptyProps(),
    'Load Todos Success': props<{ todos: TodoDto[] }>(),
    'Load Todos Failure': props<{ error: string }>(),
    'Create Todo': props<{ todo: TodoDto }>(),
    'Create Todo Success': props<{ todo: TodoDto }>(),
    'Create Todo Failure': props<{ error: string }>(),
    'Delete Todo': props<{ id: number }>(),
    'Delete Todo Success': props<{ id: number }>(),
    'Delete Todo Failure': props<{ error: string }>(),
  },
});
