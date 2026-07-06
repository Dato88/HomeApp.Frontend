import {
  Component,
  inject,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  ButtonComponent,
  DialogComponent,
  SkeletonComponent,
} from '@Dato88/homeapp-lib';
import { TodoDto } from '../shared/_interfaces/todo/todo-dto';
import { TodoCreateFormComponent } from './todo-create-form/todo-create-form.component';
import { TodoStore } from './+store/todo-store';
import { ConfirmDialogComponent } from '../shared/ui/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../shared/ui/empty-state/empty-state.component';
import { PageHeaderComponent } from '../shared/ui/page-header/page-header.component';

@Component({
  selector: 'home-todo',
  imports: [
    DatePipe,
    TodoCreateFormComponent,
    SkeletonComponent,
    ButtonComponent,
    DialogComponent,
    ConfirmDialogComponent,
    EmptyStateComponent,
    PageHeaderComponent,
  ],
  templateUrl: './todo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  readonly store = inject(TodoStore);

  protected readonly skeletonRows = [0, 1, 2];

  private readonly createForm = viewChild(TodoCreateFormComponent);

  onCreateDialogClosed(): void {
    this.createForm()?.resetForm();
  }

  completeTodoToggle(todo: TodoDto): void {
    this.store.completeTodo(todo);
  }

  deleteTodo(todo: TodoDto): void {
    this.store.deleteTodo(todo.todoId);
  }
}
