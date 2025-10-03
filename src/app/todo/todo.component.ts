import { Component, computed, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoDto } from '../shared/_interfaces/todo/todo-dto';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgStyle } from '@angular/common';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodoCreateFormComponent } from './todo-create-form/todo-create-form.component';
import { TodoStore } from './+store/todo-store';
import { SkeletonComponent } from '../shared/templates/skeleton/skeleton.component';

@Component({
  selector: 'hoa-todo',
  imports: [
    DatePipe,
    MatIconModule,
    NgStyle,
    ReactiveFormsModule,
    TodoCreateFormComponent,
    SkeletonComponent,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  readonly #todoStore = inject(TodoStore);

  todos = computed(() => this.#todoStore.todoEntities());
  loading = computed(() => this.#todoStore.isLoading);

  @ViewChild(TodoFormComponent) todoFormComponent!: TodoFormComponent;

  onDialogClose(): void {
    if (this.todoFormComponent) {
      this.todoFormComponent.resetForm();
    }
  }

  completeTodoToggle(todo: TodoDto): void {
    this.#todoStore.completeTodo(todo);
  }

  deleteTodo(todoId: number): void {
    this.#todoStore.deleteTodo(todoId);
  }
}
