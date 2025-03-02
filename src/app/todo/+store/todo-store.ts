import { inject } from '@angular/core';
import { signalStore, withProps, withMethods, withHooks } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../shared/services/person/todo.service';
import { completeTodo } from './methods/complete-todo';
import { deleteTodo } from './methods/delete-todo';
import { loadTodos } from './methods/load-todos';

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withEntities<TodoDto>(),
  withProps(() => ({ _todoService: inject(TodoService), isLoading: false, error: null })),
  withMethods((store) => ({
    loadTodos: () => loadTodos(store, store._todoService),
    completeTodo: (todo: TodoDto) => completeTodo(store, store._todoService, todo),
    deleteTodo: (id: number) => deleteTodo(store, store._todoService, id),
  })),
  withHooks({
    onInit({ loadTodos }) {
      loadTodos();
    },
    onDestroy() {
      console.log('TodoStore destroyed');
    },
  })
);
