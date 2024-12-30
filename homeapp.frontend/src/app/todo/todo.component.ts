import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoDto } from '../shared/_interfaces/todo/todo-dto';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe, NgStyle } from '@angular/common';
import { Store } from '@ngrx/store';
import { TodoActions } from '../shared/+store/todo/todo.actions';
import { Observable } from 'rxjs';
import {
  selectAllTodos,
  selectTodoError,
  selectTodosLoading,
} from '../shared/+store/todo/todo.selectors';
import { TodoFormComponent } from './todo-form/todo-form.component';

@Component({
  selector: 'hoa-todo',
  imports: [AsyncPipe, DatePipe, MatIconModule, NgStyle, ReactiveFormsModule, TodoFormComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  public errorMessage: string;
  public showError: boolean;

  todos$: Observable<TodoDto[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.errorMessage = '';
    this.showError = false;
    this.store.dispatch(TodoActions.loadTodos());

    this.todos$ = this.store.select(selectAllTodos);
    this.loading$ = this.store.select(selectTodosLoading);

    this.store.select(selectTodoError).subscribe((error) => {
      this.showError = !!error;
      this.errorMessage = error || '';
    });
  }

  @ViewChild(TodoFormComponent) todoFormComponent!: TodoFormComponent;

  // Diese Methode wird beim Schließen des Dialogs aufgerufen
  onDialogClose(): void {
    if (this.todoFormComponent) {
      this.todoFormComponent.resetForm();
    }
  }
}
