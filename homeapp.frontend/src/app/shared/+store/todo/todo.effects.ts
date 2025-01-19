import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TodoActions } from './todo.actions';
import { TodoService } from '../../services/person/todo.service';
import { of } from 'rxjs';

@Injectable()
export class TodoEffects {
  #actions$: Actions = inject(Actions);
  #todoService = inject(TodoService);

  loadTodos$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() =>
        this.#todoService.getTodos().pipe(
          map((todos) => TodoActions.loadTodosSuccess({ todos })),
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
          map((createdTodo) => TodoActions.createTodoSuccess({ todo: createdTodo })),
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
          map((response) => TodoActions.completeTodoSuccess({ todo: response })),
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
