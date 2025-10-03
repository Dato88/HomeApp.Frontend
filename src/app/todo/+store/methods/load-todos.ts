import { patchState } from '@ngrx/signals';
import { addEntity, setAllEntities } from '@ngrx/signals/entities';
import { catchError, finalize, map, of } from 'rxjs';
import { TodoService } from '../../../shared/services/person/todo.service';
import { BaseResponse } from '../../../shared/_interfaces/base-response';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { todoEntities } from '../todo-store';

export async function loadTodos(store: any, _todoService: TodoService) {
  patchState(store, (state) => ({ ...state, isLoading: true }));

  _todoService
    .getAllTodos()
    .pipe(
      map((result: BaseResponse<TodoDto[]>) => {
        if (!result.isSuccess) {
          console.log('laden', result);
          patchState(store, { error: result.message ?? 'Todos are empty' });
          return of(null);
        }

        return patchState(store, setAllEntities(result.value, todoEntities));
      }),
      catchError((error) => {
        console.error('Error loading todos:', error.message);
        patchState(store, (state) => ({
          ...state,
          error: error.message ?? 'Failed to load todos',
        }));
        return of();
      }),
      finalize(() => {
        patchState(store, (state) => ({ ...state, isLoading: false }));
      })
    )
    .subscribe();
}
