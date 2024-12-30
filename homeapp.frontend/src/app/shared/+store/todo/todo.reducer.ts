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
  }),
  on(TodoActions.createTodo, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.createTodoSuccess, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, todo],
    loading: false,
    error: null,
  })),
  on(TodoActions.createTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodoActions.deleteTodo, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.deleteTodoSuccess, (state, { id }) => ({
    ...state,
    todos: [...state.todos.filter((todo) => todo.id !== id)],
    loading: false,
    error: null,
  })),
  on(TodoActions.deleteTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
