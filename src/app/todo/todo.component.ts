import { Component, computed, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoDto } from '../shared/_interfaces/todo/todo-dto';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, NgStyle } from '@angular/common';
import { Store } from '@ngrx/store';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodoCreateFormComponent } from './todo-create-form/todo-create-form.component';
import { TodoStore } from './+store/todo-store';

@Component({
  selector: 'hoa-todo',
  imports: [
    DatePipe,
    MatIconModule,
    MatProgressSpinnerModule,
    NgStyle,
    ReactiveFormsModule,
    TodoCreateFormComponent,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  readonly #todoStore = inject(TodoStore);

  public errorMessage: string;
  public showError: boolean;

  todos = computed(() => Object.values(this.#todoStore.entityMap()));
  loading = computed(() => this.#todoStore.isLoading);

  private touchStartX: number = 0;

  constructor(private store: Store) {
    this.errorMessage = '';
    this.showError = false;
  }

  @ViewChild(TodoFormComponent) todoFormComponent!: TodoFormComponent;

  onDialogClose(): void {
    if (this.todoFormComponent) {
      this.todoFormComponent.resetForm();
    }
  }

  completeTodoToggle(todo: TodoDto): void {
    this.#todoStore.completeTodo(todo);
  }

  deleteTodo(id: number): void {
    this.#todoStore.deleteTodo(id);
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
