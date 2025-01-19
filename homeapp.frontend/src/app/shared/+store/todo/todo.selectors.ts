import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodo from './todo.reducer';
import { TodoState } from '../../_interfaces/states/todo-state';

export const selectTodoState = createFeatureSelector<TodoState>(fromTodo.todoFeatureKey);

export const selectTodosLoading = createSelector(selectTodoState, (state) => state.loading);

export const selectAllTodos = createSelector(selectTodoState, (state) =>
  state.ids.map((id) => state.entities[id])
);

export const selectTodoError = createSelector(selectTodoState, (state) => state.error);

export const selectTodoById = (id: number) =>
  createSelector(selectTodoState, (state) => state.entities[id]);
