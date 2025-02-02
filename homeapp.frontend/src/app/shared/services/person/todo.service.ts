import { inject, Injectable } from '@angular/core';
import { TodoDto } from '../../_interfaces/todo/todo-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_TODO_ENDPOINTS } from '../../../../api-endpoints/api-todo-endpoints';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../_interfaces/base-response';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  readonly #http = inject(HttpClient);

  public create(todo: TodoDto): Observable<BaseResponse<TodoDto>> {
    return this.#http.post<BaseResponse<TodoDto>>(
      `${environment.backendUrl}/${API_TODO_ENDPOINTS.todo}`,
      todo
    );
  }

  public update(todo: TodoDto): Observable<BaseResponse<TodoDto>> {
    return this.#http.patch<BaseResponse<TodoDto>>(
      `${environment.backendUrl}/${API_TODO_ENDPOINTS.todo}`,
      todo
    );
  }

  public delete(id: number): Observable<void> {
    return this.#http.delete<void>(
      `${environment.backendUrl}/${API_TODO_ENDPOINTS.todo}/?id=${id}`
    );
  }

  public getTodos(): Observable<BaseResponse<TodoDto[]>> {
    return this.#http.get<BaseResponse<TodoDto[]>>(
      `${environment.backendUrl}/${API_TODO_ENDPOINTS.todos}`
    );
  }
}
