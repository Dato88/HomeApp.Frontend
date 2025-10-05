import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';
import { TodoStore } from '../+store/todo-store';

@Component({
  selector: 'home-todo-create-form',
  imports: [TodoFormComponent],
  templateUrl: './todo-create-form.component.html',
  styleUrl: './todo-create-form.component.scss',
})
export class TodoCreateFormComponent {
  readonly #store = inject(TodoStore);
  @Output() closeDialog = new EventEmitter<void>();

  create(todo: TodoDto) {
    this.#store.createTodo(todo);

    this.closeDialog.emit();
  }
}
