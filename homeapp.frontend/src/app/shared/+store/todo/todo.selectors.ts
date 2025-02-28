import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState, todoAdapter } from './todo.adapter';
import * as fromTodo from './todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>(fromTodo.todoFeatureKey);

export const {
  selectIds: selectTodoIds,
  selectEntities: selectTodoEntities,
  selectAll: selectAllTodos,
  selectTotal: selectTotalTodos,
} = todoAdapter.getSelectors(selectTodoState);

export const selectTodosLoading = createSelector(selectTodoState, (state) => state.loading);

export const selectTodoError = createSelector(selectTodoState, (state) => state.error);
