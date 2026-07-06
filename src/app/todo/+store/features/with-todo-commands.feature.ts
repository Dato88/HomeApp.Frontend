import { inject, ResourceRef } from '@angular/core';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  addEntity,
  NamedEntityState,
  removeEntities,
  updateEntity,
} from '@ngrx/signals/entities';
import { exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';
import { BaseResponse } from '../../../shared/_interfaces/base-response';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { todoEntities } from '../todo-store';

export function withTodoCommands() {
  return signalStoreFeature(
    {
      props: type<{
        _todoService: TodoService;
        todosResource: ResourceRef<TodoDto[]>;
      }>(),
      methods: type<{ _handleError: (error: unknown) => void }>(),
      state: type<
        { isSaving: boolean; error: string | null } &
          NamedEntityState<TodoDto, 'todo'>
      >(),
    },
    withMethods((store, toast = inject(ToastService)) => ({
      createTodo: rxMethod<TodoDto>(
        pipe(
          tap(() => patchState(store, { isSaving: true, error: null })),
          exhaustMap((dto) =>
            store._todoService.createTodo(dto).pipe(
              switchMap((createResult: BaseResponse<number>) => {
                if (!createResult.isSuccess) {
                  patchState(store, {
                    error: createResult.message ?? 'Todo konnte nicht angelegt werden',
                  });
                  return of(null);
                }
                return store._todoService.getTodo(createResult.value);
              }),
              tapResponse({
                next: (result: BaseResponse<TodoDto> | null) => {
                  if (result?.isSuccess) {
                    patchState(
                      store,
                      addEntity({ ...result.value }, todoEntities)
                    );
                    toast.success('Todo angelegt');
                  } else if (result) {
                    patchState(store, {
                      error: result.message ?? 'Angelegtes Todo konnte nicht geladen werden',
                    });
                  }
                },
                error: (err) => store._handleError(err),
                finalize: () => patchState(store, { isSaving: false }),
              })
            )
          )
        )
      ),

      completeTodo: rxMethod<TodoDto>(
        pipe(
          tap((todo) => {
            patchState(
              store,
              updateEntity(
                {
                  id: todo.todoId,
                  changes: (entity) => ({ ...entity, isLoading: true }),
                },
                todoEntities
              )
            );
          }),
          exhaustMap((todo) => {
            const updatedTodo = { ...todo, done: !todo.done };
            return store._todoService.updateTodo(updatedTodo).pipe(
              switchMap((updateResult: BaseResponse<boolean>) => {
                if (!updateResult.isSuccess) {
                  patchState(
                    store,
                    updateEntity(
                      {
                        id: todo.todoId,
                        changes: (entity) => ({ ...entity, isLoading: false }),
                      },
                      todoEntities
                    )
                  );
                  return of(null);
                }
                return store._todoService.getTodo(todo.todoId);
              }),
              tapResponse({
                next: (getResult: BaseResponse<TodoDto> | null) => {
                  if (!getResult?.isSuccess) {
                    if (getResult) {
                      patchState(store, {
                        error:
                          getResult.message ??
                          'Aktualisiertes Todo konnte nicht geladen werden',
                      });
                    }
                    patchState(
                      store,
                      updateEntity(
                        {
                          id: todo.todoId,
                          changes: (entity) => ({ ...entity, isLoading: false }),
                        },
                        todoEntities
                      )
                    );
                    return;
                  }
                  patchState(
                    store,
                    updateEntity(
                      {
                        id: todo.todoId,
                        changes: () => ({
                          ...getResult.value,
                          isLoading: false,
                        }),
                      },
                      todoEntities
                    )
                  );
                },
                error: (err) => {
                  store._handleError(err);
                  patchState(
                    store,
                    updateEntity(
                      {
                        id: todo.todoId,
                        changes: (entity) => ({ ...entity, isLoading: false }),
                      },
                      todoEntities
                    )
                  );
                },
              })
            );
          })
        )
      ),

      deleteTodo: rxMethod<number>(
        pipe(
          exhaustMap((todoId) =>
            store._todoService.deleteTodo(todoId).pipe(
              tapResponse({
                next: (response) => {
                  if (response.isSuccess) {
                    patchState(store, removeEntities([todoId], todoEntities));
                    toast.success('Todo gelöscht');
                  } else {
                    patchState(store, {
                      error: response.message ?? 'Todo konnte nicht gelöscht werden',
                    });
                  }
                },
                error: (err) => store._handleError(err),
              })
            )
          )
        )
      ),
    }))
  );
}
