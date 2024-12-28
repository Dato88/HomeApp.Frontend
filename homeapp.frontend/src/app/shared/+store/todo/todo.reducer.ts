import { createReducer, on } from '@ngrx/store';
import { TodoActions } from './todo.actions';
import { TodoDto } from '../../_interfaces/todo/todo-dto';

export const todoFeatureKey = 'todoState';

export interface TodoState {
  todos: TodoDto[];
  loading: boolean;
  error: string | null;
}

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, (state) => {
    return { ...state, loading: true };
  }),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => {
    return { ...state, todos, loading: false };
  }),
  on(TodoActions.loadTodosFailure, (state, { error }) => {
    return { ...state, loading: false, error };
  })
);
