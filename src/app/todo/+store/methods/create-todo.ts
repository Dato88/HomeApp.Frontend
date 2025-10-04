import { patchState } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { catchError, of, switchMap, tap } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';
import { BaseResponse } from '../../../shared/_interfaces/base-response';
import { todoEntities } from '../todo-store';

export function createTodo(store: any, _todoService: TodoService, todo: TodoDto) {
  _todoService
    .createTodo(todo)
    .pipe(
      switchMap((createResult: BaseResponse<number>) => {
        if (!createResult.isSuccess) {
          patchState(store, { error: createResult.message ?? 'Failed to create todo' });

          return of(null);
        }

        return _todoService.getTodo(createResult.value);
      }),
      tap((result: BaseResponse<TodoDto> | null) => {
        if (!result) return;

        if (result.isSuccess) {
          return patchState(
            store,
            addEntity(
              {
                ...result.value,
                id: result.value.todoId,
              },
              todoEntities
            )
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
