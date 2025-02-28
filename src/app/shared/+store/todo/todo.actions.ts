import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { TodoDto } from '../../_interfaces/todo/todo-dto';

export const TodoActions = createActionGroup({
  source: 'Todo',
  events: {
    'Load Todo By Id': props<{ id: number }>(),
    'Load Todo By Id Success': props<{ todo: TodoDto }>(),
    'Load Todo By Id Failure': props<{ error: string }>(),
    'Load Todos': emptyProps(),
    'Load Todos Success': props<{ todos: TodoDto[] }>(),
    'Load Todos Failure': props<{ error: string }>(),
    'Create Todo': props<{ todo: TodoDto }>(),
    'Create Todo Success': props<{ todo: TodoDto }>(),
    'Create Todo Failure': props<{ error: string }>(),
    'Complete Todo': props<{ todo: TodoDto }>(),
    'Complete Todo Success': props<{ todo: TodoDto }>(),
    'Complete Todo Failure': props<{ error: string }>(),
    'Delete Todo': props<{ id: number }>(),
    'Delete Todo Success': props<{ id: number }>(),
    'Delete Todo Failure': props<{ error: string }>(),
  },
});
