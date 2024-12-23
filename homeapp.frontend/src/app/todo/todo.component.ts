import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoDto } from '../shared/_interfaces/todo/todo-dto';
import { TodoPriorityEnum } from '../shared/enum/todo-priority.enum';
import { TodoService } from '../shared/services/person/todo.service';

@Component({
  selector: 'hoa-todo',
  imports: [],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  public todoForm: FormGroup;
  public errorMessage: string;
  public showError: boolean;

  readonly #todoService = inject(TodoService);

  private fb = inject(FormBuilder);
  bla: TodoDto[] = [];

  constructor() {
    this.todoForm = new FormGroup({});
    this.errorMessage = '';
    this.showError = false;

    this.#todoService.getTodos().subscribe((todos) => {
      console.log(todos);
      this.bla = todos;
    });
  }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      id: this.fb.control<number>(0, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      todoGroupId: this.fb.control<number | null>(null),
      name: this.fb.control<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      done: this.fb.control<boolean>(false, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      priority: this.fb.control<TodoPriorityEnum>(0, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      executionDate: this.fb.control<Date | null>(null, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }
}
