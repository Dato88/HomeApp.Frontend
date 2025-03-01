import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { initialTodoState } from './models/interfaces/todo-state';
import { inject } from '@angular/core';
import { TodoService } from '../../shared/services/person/todo.service';
import { firstValueFrom } from 'rxjs';

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialTodoState),
  withProps(() => ({ _todoService: inject(TodoService) })),
  withMethods((store) => {
    return {
      async _getAll() {
        patchState(store, { isLoading: true });
        try {
          const result = await firstValueFrom(store._todoService.getTodos());

          patchState(store, { entities: result.data });
        } catch (error) {
          console.error('Error fetching todos:', error);
        } finally {
          patchState(store, { isLoading: false });
        }
      },
    };
  }),
  withHooks({
    onInit({ _getAll }) {
      _getAll();
    },
    onDestroy() {
      console.log('user on destroy');
    },
  })
);
