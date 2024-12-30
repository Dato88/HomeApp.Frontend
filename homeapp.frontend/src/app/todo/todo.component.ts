import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoDto } from '../shared/_interfaces/todo/todo-dto';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe, NgClass, NgStyle } from '@angular/common';
import { Store } from '@ngrx/store';
import { TodoActions } from '../shared/+store/todo/todo.actions';
import { Observable } from 'rxjs';
import {
  selectAllTodos,
  selectTodoError,
  selectTodosLoading,
} from '../shared/+store/todo/todo.selectors';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodoCreateFormComponent } from './todo-create-form/todo-create-form.component';

@Component({
  selector: 'hoa-todo',
  imports: [
    AsyncPipe,
    DatePipe,
    MatIconModule,
    NgStyle,
    ReactiveFormsModule,
    TodoCreateFormComponent,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  public errorMessage: string;
  public showError: boolean;

  todos$: Observable<TodoDto[]>;
  loading$: Observable<boolean>;

  private touchStartX: number = 0;

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

  onDialogClose(): void {
    if (this.todoFormComponent) {
      this.todoFormComponent.resetForm();
    }
  }

  deleteTodo(id: number): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }

  onTouchStart(event: TouchEvent, todoId: number): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent, todoId: number): void {
    const touchEndX = event.touches[0].clientX;
    const todoElement = document
      .getElementById(`todo-item-${todoId}`)
      ?.getElementsByClassName('delete-button')[0];

    if (this.touchStartX - touchEndX > 10) {
      if (todoElement && !todoElement.classList.contains('swiped')) {
        todoElement.classList.toggle('swiped');
      }
    } else if (touchEndX - this.touchStartX > 10) {
      if (todoElement && todoElement.classList.contains('swiped')) {
        todoElement.classList.toggle('swiped');
      }
    }
  }

  onTouchEnd(event: TouchEvent, todoId: number): void {}
}
