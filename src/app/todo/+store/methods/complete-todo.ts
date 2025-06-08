import { patchState } from '@ngrx/signals';
import { updateEntity } from '@ngrx/signals/entities';
import { take } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';
import { BaseResponse } from '../../../shared/_interfaces/base-response';

export function completeTodo(store: any, _todoService: TodoService, todo: TodoDto) {
  // Set isLoading to true on the specific entity
  patchState(
    store,
    updateEntity({
      id: todo.id,
      changes: (entity) => ({ ...entity, isLoading: true }),
    })
  );

  const updatedTodo = { ...todo, done: !todo.done };

  _todoService
    .update(updatedTodo)
    .pipe(take(1))
    .subscribe({
      next: (updateResult: BaseResponse<boolean>) => {
        if (!updateResult.isSuccess) {
          console.error('Error updating todo:', updateResult.message);
          patchState(
            store,
            updateEntity({
              id: todo.id,
              changes: (entity) => ({ ...entity, isLoading: false }),
            })
          );
          return;
        }

        _todoService
          .getTodo(todo.id)
          .pipe(take(1))
          .subscribe({
            next: (getResult: BaseResponse<TodoDto>) => {
              if (getResult.isSuccess) {
                patchState(
                  store,
                  updateEntity({
                    id: todo.id,
                    changes: (entity) => ({ ...entity, ...getResult.value, isLoading: false }),
                  })
                );
              } else {
                console.error('Error loading updated todo:', getResult.message);
                patchState(
                  store,
                  updateEntity({
                    id: todo.id,
                    changes: (entity) => ({ ...entity, isLoading: false }),
                  })
                );
              }
            },
            error: (error) => {
              console.error('Unexpected error fetching updated todo:', error);
              patchState(
                store,
                updateEntity({
                  id: todo.id,
                  changes: (entity) => ({ ...entity, isLoading: false }),
                })
              );
            },
          });
      },
      error: (error) => {
        console.error('Unexpected error updating todo:', error);
        patchState(
          store,
          updateEntity({
            id: todo.id,
            changes: (entity) => ({ ...entity, isLoading: false }),
          })
        );
      },
    });
}
