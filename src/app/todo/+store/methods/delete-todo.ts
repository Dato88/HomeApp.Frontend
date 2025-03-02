import { patchState } from '@ngrx/signals';
import { removeEntities } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { TodoService } from '../../../shared/services/person/todo.service';

export async function deleteTodo(store: any, _todoService: TodoService, id: number) {
  try {
    await firstValueFrom(_todoService.delete(id));
    patchState(store, removeEntities([id]));
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
}
