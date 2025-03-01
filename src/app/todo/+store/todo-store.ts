import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { initialTodoState } from './models/interfaces/todo-state';
import { inject } from '@angular/core';
import { TodoService } from '../../shared/services/person/todo.service';
import { firstValueFrom } from 'rxjs';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialTodoState),
  //   withEntities<TodoDto[]>(),
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
      async completeTodo(todo: TodoDto) {
        patchState(store, (state) => ({
          entities: {
            ...state.entities,
            [todo.id]: { ...state.entities[todo.id], isLoading: true },
          },
        }));

        try {
          const updatedTodo = { ...todo, done: !todo.done };

          const result = await firstValueFrom(store._todoService.update(updatedTodo));

          if (!result.success) {
            throw new Error('400 Bad Request');
          }

          patchState(store, (state) => ({
            entities: {
              ...state.entities,
              [todo.id]: { ...updatedTodo, isLoading: false },
            },
          }));
        } catch (error) {
          console.error('Error updating todo:', error);
          patchState(store, { error: 'Fehler beim Aktualisieren des Todos' });
        } finally {
          patchState(store, (state) => ({
            entities: {
              ...state.entities,
              [todo.id]: { ...state.entities[todo.id], isLoading: false },
            },
          }));
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
