import { createReducer, on } from '@ngrx/store';
import { TodoActions } from './todo.actions';
import { initialState, todoAdapter } from './todo.adapter';

export const todoFeatureKey = 'todoState';

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => {
    return todoAdapter.setAll(todos, { ...state, loading: false });
  }),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodoActions.loadTodoByIdSuccess, (state, { todo }) => {
    return todoAdapter.updateOne({ id: todo.id, changes: { ...todo } }, { ...state });
  }),
  on(TodoActions.loadTodoByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodoActions.createTodo, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.createTodoSuccess, (state, { todo }) => {
    return todoAdapter.addOne(todo, { ...state, loading: false });
  }),
  on(TodoActions.createTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodoActions.completeTodo, (state, { todo }) => {
    return todoAdapter.updateOne(
      { id: todo.id, changes: { ...todo, loading: true } },
      { ...state }
    );
  }),
  on(TodoActions.completeTodoSuccess, (state, { todo }) => {
    return todoAdapter.updateOne(
      { id: todo.id, changes: { ...todo, loading: false } },
      { ...state }
    );
  }),
  on(TodoActions.completeTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodoActions.deleteTodo, (state, { id }) => {
    return todoAdapter.removeOne(id, { ...state });
  }),
  on(TodoActions.deleteTodoSuccess, (state, { id }) => {
    return todoAdapter.removeOne(id, { ...state });
  }),
  on(TodoActions.deleteTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
