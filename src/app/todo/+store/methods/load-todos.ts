import { patchState } from '@ngrx/signals';
import { addEntities } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { TodoService } from '../../../shared/services/person/todo.service';
import { BaseResponse } from '../../../shared/_interfaces/base-response';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';

export async function loadTodos(store: any, _todoService: TodoService) {
  patchState(store, (state) => ({ ...state, isLoading: true }));

  try {
    const result: BaseResponse<TodoDto[]> = await firstValueFrom(_todoService.getTodos());

    if (result.isSuccess) {
      patchState(store, addEntities(result.value));
    } else {
      console.error('Error loading todos:', result.message);
      patchState(store, (state) => ({
        ...state,
        error: result.message ?? 'Failed to load todos',
      }));
    }
  } catch (error) {
    // Fallback for unexpected errors (e.g. network issues)
    console.error('Unexpected error fetching todos:', error);
    patchState(store, (state) => ({
      ...state,
      error: 'Unexpected error while loading todos',
    }));
  } finally {
    patchState(store, (state) => ({ ...state, isLoading: false }));
  }
}
