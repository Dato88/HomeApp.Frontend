import { patchState } from '@ngrx/signals';
import { addEntities } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { TodoService } from '../../../shared/services/person/todo.service';

export async function loadTodos(store: any, _todoService: TodoService) {
  patchState(store, (state) => ({ ...state, isLoading: true }));

  try {
    const result = await firstValueFrom(_todoService.getTodos());
    patchState(store, addEntities(result.data));
  } catch (error) {
    console.error('Error fetching todos:', error);
    patchState(store, (state) => ({ ...state, error: 'Fehler beim Laden der Todos' }));
  } finally {
    patchState(store, (state) => ({ ...state, isLoading: false }));
  }
}
