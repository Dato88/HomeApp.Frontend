import { patchState } from '@ngrx/signals';
import { addEntities } from '@ngrx/signals/entities';
import { catchError, map, of } from 'rxjs';
import { TodoService } from '../../../shared/services/person/todo.service';
import { BaseResponse } from '../../../shared/_interfaces/base-response';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';

export async function loadTodos(store: any, _todoService: TodoService) {
  patchState(store, (state) => ({ ...state, isLoading: true }));

  _todoService
    .getTodos()
    .pipe(
      map((result: BaseResponse<TodoDto[]>) => {
        if (!result.isSuccess) {
          patchState(store, { error: result.message ?? 'Todos are empty' });
          return of(null);
        }

        return patchState(
          store,
          addEntities(
            result.value.map((todo) => ({
              ...todo,
              id: todo.todoId,
            }))
          )
        );
      }),
      catchError((error) => {
        console.error('Error loading todos:', error.message);
        patchState(store, (state) => ({
          ...state,
          error: error.message ?? 'Failed to load todos',
        }));
        return of();
      })
    )
    .subscribe(() => {
      patchState(store, (state) => ({ ...state, isLoading: false }));
    });
}
