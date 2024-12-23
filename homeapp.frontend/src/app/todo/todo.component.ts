import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoDto } from '../shared/_interfaces/todo/todo-dto';
import { TodoPriorityEnum } from '../shared/enum/todo-priority.enum';
import { TodoService } from '../shared/services/person/todo.service';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'hoa-todo',
  imports: [DatePipe, MatIconModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  public todoForm: FormGroup;
  public errorMessage: string;
  public showError: boolean;

  readonly #todoService = inject(TodoService);
  private fb = inject(FormBuilder);
  todoDtos: TodoDto[] = [];

  constructor() {
    this.todoForm = this.fb.group({});
    this.errorMessage = '';
    this.showError = false;

    this.#todoService.getTodos().subscribe((todos) => {
      console.log(todos);
      this.todoDtos = todos; // Aufruf der Methode, um das Formular zu aktualisieren
    });
  }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      // Standardfelder für das Formular, die zuerst definiert sind
      id: this.fb.control<number>(0, { validators: [Validators.required], nonNullable: true }),
      name: this.fb.control<string>('', { validators: [Validators.required], nonNullable: true }),
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
