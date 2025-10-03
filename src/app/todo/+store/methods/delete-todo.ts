import { patchState } from '@ngrx/signals';
import { removeEntities } from '@ngrx/signals/entities';
import { catchError, of, tap } from 'rxjs';
import { TodoService } from '../../../shared/services/person/todo.service';
import { todoEntities } from '../todo-store';

export async function deleteTodo(store: any, _todoService: TodoService, todoId: number) {
  _todoService
    .deleteTodo(todoId)
    .pipe(
      tap((response) => {
        if (response.isSuccess) {
          patchState(store, removeEntities([todoId], todoEntities));
        } else {
          console.error('Deletion error:', response.message);
          console.error(`[${response.error?.code}] ${response.error?.description}`);
        }
      }),
      catchError((error) => {
        console.error('Unexpected error during delete:', error);
        patchState(store, { error: 'Unexpected error while deleting todo' });

        return of();
      })
    )
    .subscribe();
}
