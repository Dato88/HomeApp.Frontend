import { patchState } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { catchError, of, switchMap, take, tap } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';
import { BaseResponse } from '../../../shared/_interfaces/base-response';

export function createTodo(store: any, _todoService: TodoService, todo: TodoDto) {
  _todoService
    .create(todo)
    .pipe(
      take(1),
      switchMap((createResult: BaseResponse<number>) => {
        if (!createResult.isSuccess) {
          // Handle creation failure without calling getTodo
          patchState(store, { error: createResult.message ?? 'Failed to create todo' });
          return of(null);
        }

        // If creation was successful, fetch the newly created Todo
        return _todoService.getTodo(createResult.value).pipe(take(1));
      }),
      tap((loadedTodo: BaseResponse<TodoDto> | null) => {
        if (!loadedTodo) return;

        if (loadedTodo.isSuccess) {
          patchState(store, addEntity(loadedTodo.value));
        } else {
          patchState(store, { error: loadedTodo.message ?? 'Failed to load created todo' });
        }
      }),
      catchError((error) => {
        // Fallback in case of unexpected runtime/transport errors
        console.error('Unexpected error during create or fetch:', error);
        patchState(store, { error: 'Unexpected error while creating todo' });
        return of(); // prevent further errors
      })
    )
    .subscribe();
}
