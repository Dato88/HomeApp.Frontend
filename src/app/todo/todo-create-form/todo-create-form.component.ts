import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';
import { Store } from '@ngrx/store';
import { TodoActions } from '../../shared/+store/todo/todo.actions';

@Component({
  selector: 'hoa-todo-create-form',
  imports: [TodoFormComponent],
  templateUrl: './todo-create-form.component.html',
  styleUrl: './todo-create-form.component.scss',
})
export class TodoCreateFormComponent {
  readonly #store = inject(Store);
  @Output() closeDialog = new EventEmitter<void>();

  create(todo: TodoDto) {
    this.#store.dispatch(TodoActions.createTodo({ todo }));

    this.closeDialog.emit();
  }
}
