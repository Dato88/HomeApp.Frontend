import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of, tap, mergeMap } from 'rxjs';
import { TodoService } from '../../services/person/todo.service';
import { TodoActions } from './todo.actions';

@Injectable()
export class TodoEffects {
  #actions$: Actions = inject(Actions);
  #todoService = inject(TodoService);

  loadTodoById$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TodoActions.loadTodoById),
      switchMap(({ id }) =>
        this.#todoService.getTodo(id).pipe(
          map((response) => TodoActions.loadTodoByIdSuccess({ todo: response.data })),
          catchError((error) => of(TodoActions.loadTodoByIdFailure({ error: error.message })))
        )
      )
    );
  });

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
          switchMap((response) => {
            return response.success
              ? [TodoActions.loadTodoById({ id: response.data })]
              : [TodoActions.createTodoFailure({ error: 'Failed to create todo' })];
          }),
          catchError((error) => of(TodoActions.createTodoFailure({ error: error.message })))
        )
      )
    );
  });

  completeTodo$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TodoActions.completeTodo), // Wenn completeTodo Action ausgelöst wird
      switchMap(({ todo }) => {
        const updatedTodo = { ...todo, done: !todo.done };

        return this.#todoService.update(updatedTodo).pipe(
          mergeMap((response) =>
            response.success
              ? [
                  TodoActions.completeTodoSuccess({ todo: updatedTodo }),
                  TodoActions.loadTodoById({ id: updatedTodo.id }),
                ]
              : [TodoActions.completeTodoFailure({ error: 'Failed to update todo' })]
          ),
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
