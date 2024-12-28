import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoDto } from '../shared/_interfaces/todo/todo-dto';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { TodoActions } from '../shared/+store/todo/todo.actions';
import { Observable } from 'rxjs';
import { selectAllTodos, selectTodosLoading } from '../shared/+store/todo/todo.selectors';

@Component({
  selector: 'hoa-todo',
  imports: [AsyncPipe, DatePipe, MatIconModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  public errorMessage: string;
  public showError: boolean;

  todos$: Observable<TodoDto[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.store.dispatch(TodoActions.loadTodos());
    this.errorMessage = '';
    this.showError = false;

    this.todos$ = this.store.select(selectAllTodos);
    this.loading$ = this.store.select(selectTodosLoading);
  }
}
