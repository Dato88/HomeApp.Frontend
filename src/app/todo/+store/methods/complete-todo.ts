import { patchState } from '@ngrx/signals';
import { updateEntity } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';

export async function completeTodo(store: any, _todoService: TodoService, todo: TodoDto) {
  patchState(
    store,
    updateEntity({ id: todo.id, changes: (todoId) => ({ ...todoId, isLoading: true }) })
  );

  try {
    const updatedTodo = { ...todo, done: !todo.done };
    const result = await firstValueFrom(_todoService.update(updatedTodo));

    if (!result.success) {
      throw new Error('400 Bad Request');
    }

    const loadedTodo = await firstValueFrom(_todoService.getTodo(todo.id));
    patchState(
      store,
      updateEntity({
        id: todo.id,
        changes: (todoId) => ({ ...todoId, ...loadedTodo.data, isLoading: false }),
      })
    );
  } catch (error) {
    console.error('Error updating todo:', error);

    patchState(store, (state) => ({ ...state, error: 'Failed to update todo' }));

    patchState(
      store,
      updateEntity({ id: todo.id, changes: (todoId) => ({ ...todoId, isLoading: false }) })
    );
  }
}
