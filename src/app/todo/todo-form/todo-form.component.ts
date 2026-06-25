import { Component, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { form, FormField, required, schema } from '@angular/forms/signals';
import { TodoPriorityEnum } from '../../shared/enum/todo-priority.enum';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';
import { ButtonComponent } from '../../shared/templates/button/button.component';

interface TodoFormModel {
  todoId: number;
  title: string;
  done: boolean;
  priority: TodoPriorityEnum;
}

@Component({
  selector: 'home-todo-form',
  imports: [FormField, ButtonComponent],
  templateUrl: './todo-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  readonly submitTodo = output<TodoDto>();

  private readonly todoModel = signal<TodoFormModel>({
    todoId: 0,
    title: '',
    done: false,
    priority: TodoPriorityEnum.Normal,
  });

  readonly todoForm = form(
    this.todoModel,
    schema((path) => {
      required(path.title);
    })
  );

  submitForm(event: Event): void {
    event.preventDefault();
    this.todoForm().markAsTouched();

    if (this.todoForm().invalid()) {
      return;
    }

    const formValue = this.todoForm().value();
    const newTodo: TodoDto = {
      ...formValue,
      isLoading: false,
    };

    this.submitTodo.emit(newTodo);
    this.resetForm();
  }

  resetForm(): void {
    this.todoForm().reset({
      todoId: 0,
      title: '',
      done: false,
      priority: TodoPriorityEnum.Normal,
    });
  }
}
