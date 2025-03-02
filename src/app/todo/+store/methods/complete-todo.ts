import { patchState } from '@ngrx/signals';
import { updateEntity } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';

export async function completeTodo(store: any, _todoService: TodoService, todo: TodoDto) {
  patchState(store, updateEntity({ id: todo.id, changes: (t) => ({ ...t, isLoading: true }) }));

  try {
    const updatedTodo = { ...todo, done: !todo.done };
    const result = await firstValueFrom(_todoService.update(updatedTodo));

    if (!result.success) {
      throw new Error('400 Bad Request');
    }

    patchState(
      store,
      updateEntity({
        id: todo.id,
        changes: (t) => ({ ...t, done: updatedTodo.done, isLoading: false }),
      })
    );
  } catch (error) {
    console.error('Error updating todo:', error);

    patchState(store, (state) => ({ ...state, error: 'Fehler beim Aktualisieren des Todos' }));

    patchState(store, updateEntity({ id: todo.id, changes: (t) => ({ ...t, isLoading: false }) }));
  }
}
