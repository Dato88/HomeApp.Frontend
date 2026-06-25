import { rxResource } from '@angular/core/rxjs-interop';
import { ResourceRef } from '@angular/core';
import { signalStoreFeature, type, withProps } from '@ngrx/signals';
import { map } from 'rxjs';
import { TodoDto } from '../../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../../shared/services/person/todo.service';
import { BaseResponse } from '../../../shared/_interfaces/base-response';

export function withTodoQueries() {
  return signalStoreFeature(
    { props: type<{ _todoService: TodoService }>() },
    withProps((store) => ({
      todosResource: rxResource({
        stream: () =>
          store._todoService.getAllTodos().pipe(
            map((result: BaseResponse<TodoDto[]>) =>
              result.isSuccess ? result.value : []
            )
          ),
      }) as ResourceRef<TodoDto[]>,
    }))
  );
}
