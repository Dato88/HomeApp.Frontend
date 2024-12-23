import { inject, Injectable } from '@angular/core';
import { TodoDto } from '../../_interfaces/todo/todo-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_TODO_ENDPOINTS } from '../../../../api-endpoints/api-todo-endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  readonly #http = inject(HttpClient);

  public getTodos(): Observable<TodoDto[]> {
    return this.#http.get<TodoDto[]>(`${environment.backendUrl}/${API_TODO_ENDPOINTS.todos}`);
  }
}
