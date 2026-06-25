import { inject, isDevMode } from '@angular/core';
import {
  signalStore,
  signalStoreFeature,
  type,
  withProps,
  withState,
} from '@ngrx/signals';
import { entityConfig, withEntities } from '@ngrx/signals/entities';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../shared/services/person/todo.service';
import { withErrorHandling } from '../../+store/features/with-error.feature';
import { withTodoQueries } from './features/with-todo-queries.feature';
import { withTodoEntitySync } from './features/with-todo-entity-sync.feature';
import { withTodoCommands } from './features/with-todo-commands.feature';

export interface TodoState {
  isSaving: boolean;
}

export const todoEntities = entityConfig({
  entity: type<TodoDto>(),
  collection: 'todo',
  selectId: (t) => t.todoId,
});

const todoStoreFeatures = [
  withState<TodoState>({ isSaving: false }),
  withProps(() => ({ _todoService: inject(TodoService) })),
  withEntities(todoEntities),
  withErrorHandling(),
  withTodoQueries(),
  withTodoEntitySync(),
  withTodoCommands(),
] as const;

const devtoolsFeature = isDevMode()
  ? withDevtools('todos')
  : signalStoreFeature(withState({}));

export const TodoStore = signalStore(
  { providedIn: 'root' },
  ...todoStoreFeatures,
  devtoolsFeature
);
