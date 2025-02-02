import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of } from 'rxjs';
import { TodoService } from '../../services/person/todo.service';
import { TodoActions } from './todo.actions';

@Injectable()
export class TodoEffects {
  #actions$: Actions = inject(Actions);
  #todoService = inject(TodoService);

  loadTodos$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() =>
        this.#todoService.getTodos().pipe(
          map((response) => TodoActions.loadTodosSuccess({ todos: response.data })),
          catchError((error) => of(TodoActions.loadTodosFailure({ error })))
        )
      )
    );
  });

  createTodo$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TodoActions.createTodo),
      switchMap(({ todo }) =>
        this.#todoService.create(todo).pipe(
          map((response) => TodoActions.createTodoSuccess({ todo: response.data })),
          catchError((error) => of(TodoActions.createTodoFailure({ error: error.message })))
        )
      )
    );
  });

  completeTodo$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TodoActions.completeTodo),
      switchMap(({ todo }) => {
        const updatedTodo = { ...todo, done: !todo.done };

        return this.#todoService.update(updatedTodo).pipe(
          map((response) => TodoActions.completeTodoSuccess({ todo: response.data })),
          catchError((error) => of(TodoActions.completeTodoFailure({ error: error.message })))
        );
      })
    );
  });

  deleteTodo$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TodoActions.deleteTodo),
      switchMap(({ id }) =>
        this.#todoService.delete(id).pipe(
          map(() => TodoActions.deleteTodoSuccess({ id })),
          catchError((error) => of(TodoActions.deleteTodoFailure({ error: error.message })))
        )
      )
    );
  });
}
