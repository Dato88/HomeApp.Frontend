import { inject } from '@angular/core';
import { signalStore, withProps, withMethods, withHooks, type } from '@ngrx/signals';
import { entityConfig, withEntities } from '@ngrx/signals/entities';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';
import { TodoService } from '../../shared/services/person/todo.service';
import { completeTodo } from './methods/complete-todo';
import { deleteTodo } from './methods/delete-todo';
import { loadTodos } from './methods/load-todos';
import { createTodo } from './methods/create-todo';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

const todoConfig = entityConfig({
  entity: type<TodoDto>(),
  collection: 'todo',
  selectId: (todo) => todo.todoId,
});

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withEntities(todoConfig),
  withProps(() => ({ _todoService: inject(TodoService), isLoading: false, error: null })),
  withMethods((store) => ({
    loadTodos: () => loadTodos(store, store._todoService),
    completeTodo: (todo: TodoDto) => completeTodo(store, store._todoService, todo),
    createTodo: (todo: TodoDto) => createTodo(store, store._todoService, todo),
    deleteTodo: (todoId: number) => deleteTodo(store, store._todoService, todoId),
  })),
  withHooks({
    onInit({ loadTodos }) {
      loadTodos();
    },
    onDestroy() {
      console.log('TodoStore destroyed');
    },
  }),
  withDevtools('todos)
);
