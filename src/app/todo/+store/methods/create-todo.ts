import { patchState } from '@ngrx/signals';
import { addEntity, updateEntity } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';

export async function createTodo(store: any, _todoService: TodoService, todo: TodoDto) {
  try {
    const result = await firstValueFrom(_todoService.create(todo));

    if (!result.success) {
      throw new Error('400 Bad Request');
    }

    const loadedTodo = await firstValueFrom(_todoService.getTodo(result.data));
    patchState(store, addEntity(loadedTodo.data));
  } catch (error) {
    console.error('Error creating todo:', error);

    patchState(store, (state) => ({ ...state, error: 'Failed to create todo' }));
  }
}
