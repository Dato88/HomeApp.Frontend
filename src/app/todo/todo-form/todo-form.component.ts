import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TodoPriorityEnum } from '../../shared/enum/todo-priority.enum';
import { TodoDto } from '../../shared/_interfaces/todo/todo-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'hoa-todo-form',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  #fb = inject(FormBuilder);

  public todoForm: FormGroup;

  @Output() submitTodo: EventEmitter<TodoDto> = new EventEmitter<TodoDto>();

  constructor() {
    this.todoForm = this.#fb.group({});
  }

  ngOnInit(): void {
    this.todoForm = this.#fb.group({
      id: this.#fb.control<number>(0, { validators: [Validators.required], nonNullable: true }),
      name: this.#fb.control<string>('', { validators: [Validators.required], nonNullable: true }),
      done: this.#fb.control<boolean>(false, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      priority: this.#fb.control<TodoPriorityEnum>(0, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      executionDate: this.#fb.control<Date | null>(null, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  submitForm() {
    const formValue = this.todoForm.getRawValue();

    const newTodo: TodoDto = {
      ...formValue,
    };

    this.submitTodo.emit(newTodo);

    this.resetForm();
  }

  resetForm(): void {
    this.todoForm.reset({
      id: 0,
      name: '',
      done: false,
      priority: 0,
      executionDate: null,
    });
  }
}
