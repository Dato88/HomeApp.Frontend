import { patchState } from '@ngrx/signals';
import { updateEntity } from '@ngrx/signals/entities';
import { take } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';

export function completeTodo(store: any, _todoService: TodoService, todo: TodoDto) {
  patchState(
    store,
    updateEntity({
      id: todo.id,
      changes: (todoId) => ({ ...todoId, isLoading: true }),
    })
  );

  const updatedTodo = { ...todo, done: !todo.done };

  _todoService
    .update(updatedTodo)
    .pipe(take(1))
    .subscribe({
      next: () => {
        _todoService
          .getTodo(todo.id)
          .pipe(take(1))
          .subscribe({
            next: (result) => {
              patchState(
                store,
                updateEntity({
                  id: todo.id,
                  changes: (todoId) => ({ ...todoId, ...result.data, isLoading: false }),
                })
              );
            },
            error: (error) => {
              console.error('Error fetching updated todo:', error);
              patchState(
                store,
                updateEntity({
                  id: todo.id,
                  changes: (todoId) => ({ ...todoId, isLoading: false }),
                })
              );
            },
          });
      },
      error: (error) => {
        console.error('Error updating todo:', error);
        patchState(
          store,
          updateEntity({
            id: todo.id,
            changes: (todoId) => ({ ...todoId, isLoading: false }),
          })
        );
      },
    });
}
