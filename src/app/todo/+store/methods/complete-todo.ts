import { patchState } from '@ngrx/signals';
import { updateEntity } from '@ngrx/signals/entities';
import { catchError, map, of, switchMap, take, tap } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';
import { BaseResponse } from '../../../shared/_interfaces/base-response';

export function completeTodo(store: any, _todoService: TodoService, todo: TodoDto) {
  // Set isLoading to true on the specific entity
  patchState(
    store,
    updateEntity({
      id: todo.todoId,
      changes: (entity) => ({ ...entity, isLoading: true }),
    })
  );

  const updatedTodo = { ...todo, done: !todo.done };
  _todoService
    .update(updatedTodo)
    .pipe(
      switchMap((updateResult: BaseResponse<boolean>) => {
        if (!updateResult.isSuccess) {
          console.error('Error updating todo:', updateResult.message);
          patchState(
            store,
            updateEntity({
              id: todo.todoId,
              changes: (entity) => ({ ...entity, isLoading: false }),
            })
          );

          return of();
        }

        return _todoService.getTodo(todo.todoId);
      }),
      map((getResult: BaseResponse<TodoDto>) => {
        if (!getResult.isSuccess) {
          throw new Error(getResult.message ?? 'Fetching updated todo failed');
        }
        return getResult.value;
      }),
      tap((result) => {
        patchState(
          store,
          updateEntity({
            id: todo.todoId,
            changes: (entity) => ({ ...entity, ...result, isLoading: false }),
          })
        );
      }),
      catchError((error) => {
        console.error('Todo update error:', error.message);
        patchState(
          store,
          updateEntity({
            id: todo.todoId,
            changes: (entity) => ({ ...entity, isLoading: false }),
          })
        );
        return of();
      })
    )
    .subscribe();
}
