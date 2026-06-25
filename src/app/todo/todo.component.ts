import {
  Component,
  inject,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { TodoDto } from '../shared/_interfaces/todo/todo-dto';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodoCreateFormComponent } from './todo-create-form/todo-create-form.component';
import { TodoStore } from './+store/todo-store';
import { SkeletonComponent } from '../shared/templates/skeleton/skeleton.component';
import { ButtonComponent } from '../shared/templates/button/button.component';

@Component({
  selector: 'home-todo',
  imports: [
    DatePipe,
    MatIconModule,
    TodoCreateFormComponent,
    SkeletonComponent,
    ButtonComponent,
  ],
  templateUrl: './todo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  readonly store = inject(TodoStore);

  readonly todoFormComponent = viewChild(TodoFormComponent);

  onDialogClose(): void {
    this.todoFormComponent()?.resetForm();
  }

  completeTodoToggle(todo: TodoDto): void {
    this.store.completeTodo(todo);
  }

  deleteTodo(todoId: number): void {
    this.store.deleteTodo(todoId);
  }
}
