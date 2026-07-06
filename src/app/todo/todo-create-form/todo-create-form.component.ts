import { Component, inject, output, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';
import { TodoStore } from '../+store/todo-store';

@Component({
  selector: 'home-todo-create-form',
  imports: [TodoFormComponent],
  templateUrl: './todo-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './todo-create-form.component.scss',
})
export class TodoCreateFormComponent {
  readonly store = inject(TodoStore);
  readonly closeDialog = output<void>();

  private readonly todoForm = viewChild(TodoFormComponent);

  create(todo: TodoDto): void {
    this.store.createTodo(todo);
    this.closeDialog.emit();
  }

  resetForm(): void {
    this.todoForm()?.resetForm();
  }
}
