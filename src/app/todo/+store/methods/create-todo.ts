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
          patchState(store, { error: createResult.message ?? 'Failed to create todo' });

          return of(null);
        }

        return _todoService.getTodo(createResult.value).pipe(take(1));
      }),
      tap((result: BaseResponse<TodoDto> | null) => {
        if (!result) return;

        if (result.isSuccess) {
          return patchState(
            store,
            addEntity({
              ...result.value,
              id: result.value.todoId,
            })
          );
        } else {
          patchState(store, { error: result.message ?? 'Failed to load created todo' });
        }
      }),
      catchError((error) => {
        console.error('Unexpected error during create or fetch:', error);
        patchState(store, { error: 'Unexpected error while creating todo' });

        return of();
      })
    )
    .subscribe();
}
