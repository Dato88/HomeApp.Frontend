import { Component, computed, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { form, required, schema } from '@angular/forms/signals';
import {
  ButtonComponent,
  DropdownListComponent,
  InputFieldComponent,
} from '@Dato88/homeapp-lib';
import { TodoPriorityEnum } from '../../shared/enum/todo-priority.enum';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';
import { DropdownData } from '../../shared/models/dropdown-data.model';

interface TodoFormModel {
  todoId: number;
  title: string;
  done: boolean;
  priority: TodoPriorityEnum;
}

@Component({
  selector: 'home-todo-form',
  imports: [InputFieldComponent, ButtonComponent, DropdownListComponent],
  templateUrl: './todo-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  readonly submitTodo = output<TodoDto>();

  protected readonly priorityOptions: DropdownData[] = [
    { trackBy: TodoPriorityEnum.Normal, value: String(TodoPriorityEnum.Normal), name: 'Normal' },
    { trackBy: TodoPriorityEnum.Low, value: String(TodoPriorityEnum.Low), name: 'Niedrig' },
    { trackBy: TodoPriorityEnum.Medium, value: String(TodoPriorityEnum.Medium), name: 'Mittel' },
    { trackBy: TodoPriorityEnum.High, value: String(TodoPriorityEnum.High), name: 'Hoch' },
  ];

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

  protected readonly priorityValue = computed(() => String(this.todoForm.priority().value()));

  protected onPriorityChange(value: string): void {
    this.todoForm.priority().value.set(Number(value) as TodoPriorityEnum);
  }

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
