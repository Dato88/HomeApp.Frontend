import { effect } from '@angular/core';
import { ResourceRef } from '@angular/core';
import { patchState, signalStoreFeature, type, withHooks } from '@ngrx/signals';
import { setAllEntities } from '@ngrx/signals/entities';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { todoEntities } from '../todo-store';

export function withTodoEntitySync() {
  return signalStoreFeature(
    { props: type<{ todosResource: ResourceRef<TodoDto[]> }>() },
    withHooks({
      onInit(store) {
        effect(() => {
          const resource = store.todosResource;
          if (resource.hasValue()) {
            patchState(store, setAllEntities(resource.value(), todoEntities));
          }
        });
      },
    })
  );
}
