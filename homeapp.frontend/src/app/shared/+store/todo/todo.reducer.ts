import { createReducer, on } from '@ngrx/store';
import { TodoActions } from './todo.actions';
import { TodoDto } from '../../_interfaces/todo/todo-dto';
import { initialState } from '../../_interfaces/states/todo-state';

export const todoFeatureKey = 'todoState';

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => {
    const entities = todos.reduce(
      (acc, todo) => {
        acc[todo.id] = { ...todo, loading: false };
        return acc;
      },
      {} as { [id: number]: TodoDto }
    );

    const ids = todos.map((todo) => todo.id);

    return { ...state, entities, ids, loading: false };
  }),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodoActions.createTodo, (state, { todo }) => ({
    ...state,
    entities: {
      ...state.entities,
      [todo.id]: { ...todo, loading: true },
    },
    loading: true,
  })),
  on(TodoActions.createTodoSuccess, (state, { todo }) => ({
    ...state,
    entities: {
      ...state.entities,
      [todo.id]: { ...todo, loading: false },
    },
    ids: state.ids.includes(todo.id) ? state.ids : [...state.ids, todo.id],
    loading: false,
    error: null,
  })),
  on(TodoActions.createTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodoActions.completeTodo, (state, { todo }) => ({
    ...state,
    entities: {
      ...state.entities,
      [todo.id]: { ...state.entities[todo.id], loading: true },
    },
  })),
  on(TodoActions.completeTodoSuccess, (state, { todo }) => ({
    ...state,
    entities: {
      ...state.entities,
      [todo.id]: { ...todo, loading: false },
    },
    loading: false,
    error: null,
  })),
  on(TodoActions.completeTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    entities: {
      ...state.entities,
      [id]: { ...state.entities[id], loading: true },
    },
  })),
  on(TodoActions.deleteTodoSuccess, (state, { id }) => {
    const { [id]: deletedTodo, ...remainingEntities } = state.entities;
    return {
      ...state,
      entities: remainingEntities,
      ids: state.ids.filter((existingId) => existingId !== id),
      loading: false,
      error: null,
    };
  }),
  on(TodoActions.deleteTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
