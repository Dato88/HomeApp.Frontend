import { createReducer, on } from '@ngrx/store';
import { TodoActions } from './todo.actions';
import { initialState, todoAdapter } from './todo.adapter';

export const todoFeatureKey = 'todoState';

export const todoReducer = createReducer(
  initialState,

  //#region Load Todos
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
  //#endregion Load Todos

  //#region Load Todo By Id
  on(TodoActions.loadTodoByIdSuccess, (state, { todo }) => {
    return todoAdapter.addOne(todo, { ...state, loading: false });
  }),
  on(TodoActions.loadTodoByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  //#endregion Load Todo By Id

  //#region Create Todo
  on(TodoActions.createTodo, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.createTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  //#endregion Create Todo

  //#region Complete Todo
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
  //#endregion Complete Todo

  //#region Delete Todo
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
  //#endregion Delete Todo
);
