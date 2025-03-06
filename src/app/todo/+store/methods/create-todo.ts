import { patchState } from '@ngrx/signals';
import { addEntity } from '@ngrx/signals/entities';
import { catchError, switchMap, take, tap } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';

export function createTodo(store: any, _todoService: TodoService, todo: TodoDto) {
  _todoService
    .create(todo)
    .pipe(
      take(1),
      switchMap((result) => _todoService.getTodo(result.data).pipe(take(1))),
      tap((loadedTodo) => {
        patchState(store, addEntity(loadedTodo.data));
      }),
      catchError((error) => {
        console.error('Error creating or fetching todo:', error);
        patchState(store, { error: 'Failed to create todo' });
        throw error;
      })
    )
    .subscribe();
}
