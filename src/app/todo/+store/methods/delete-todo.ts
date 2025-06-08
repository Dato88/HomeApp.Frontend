import { patchState } from '@ngrx/signals';
import { removeEntities } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { TodoService } from '../../../shared/services/person/todo.service';

export async function deleteTodo(store: any, _todoService: TodoService, id: number) {
  const response = await firstValueFrom(_todoService.delete(id));

  if (response.isSuccess) {
    patchState(store, removeEntities([id]));
  } else {
    console.error('Deletion error:', response.message);
    response.errors?.forEach((e) => {
      console.error(`[${e.code}] ${e.message}`);
    });
  }
}
