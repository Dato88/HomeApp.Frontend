import { patchState, signalStore, withHooks, withMethods, withProps } from '@ngrx/signals';
import { addEntities, removeEntities, withEntities, updateEntity } from '@ngrx/signals/entities';
import { inject } from '@angular/core';
import { TodoService } from '../../shared/services/person/todo.service';
import { firstValueFrom } from 'rxjs';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withEntities<TodoDto>(),
  withProps(() => ({ _todoService: inject(TodoService), isLoading: false, error: null })),
  withMethods((store) => ({
    async loadTodos() {
      patchState(store, (state) => ({
        ...state,
        isLoading: true,
      }));

      try {
        const result = await firstValueFrom(store._todoService.getTodos());
        patchState(store, addEntities(result.data));
      } catch (error) {
        console.error('Error fetching todos:', error);
        patchState(store, (state) => ({
          ...state,
          error: 'Fehler beim Laden der Todos',
        }));
      } finally {
        patchState(store, (state) => ({
          ...state,
          isLoading: false,
        }));
      }
    },

    async completeTodo(todo: TodoDto) {
      patchState(store, updateEntity({ id: todo.id, changes: (t) => ({ ...t, isLoading: true }) }));

      try {
        const updatedTodo = { ...todo, done: !todo.done };
        const result = await firstValueFrom(store._todoService.update(updatedTodo));

        if (!result.success) {
          throw new Error('400 Bad Request');
        }

        patchState(
          store,
          updateEntity({
            id: todo.id,
            changes: (todo) => ({ ...todo, done: updatedTodo.done, isLoading: false }),
          })
        );
      } catch (error) {
        console.error('Error updating todo:', error);

        patchState(store, (state) => ({
          ...state,
          error: 'Fehler beim Aktualisieren des Todos',
        }));

        patchState(
          store,
          updateEntity({ id: todo.id, changes: (todo) => ({ ...todo, isLoading: false }) })
        );
      }
    },

    async deleteTodo(id: number) {
      try {
        await firstValueFrom(store._todoService.delete(id));
        patchState(store, removeEntities([id]));
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    },
  })),
  withHooks({
    onInit({ loadTodos }) {
      loadTodos();
    },
    onDestroy() {
      console.log('TodoStore destroyed');
    },
  })
);
