import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodo from './todo.reducer';

export const selectTodoState = createFeatureSelector<fromTodo.TodoState>(fromTodo.todoFeatureKey);

export const selectTodosLoading = createSelector(selectTodoState, (state) => state.loading);

export const selectAllTodos = createSelector(selectTodoState, (state) => state.todos);
