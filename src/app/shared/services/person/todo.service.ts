import { inject, Injectable } from '@angular/core';
import { TodoDto } from '../../_interfaces/todo/todo-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_TODO_ENDPOINTS } from '../../../../api-endpoints/api-todo-endpoints';
import { catchError, Observable, of } from 'rxjs';
import { handleHttpError, handleHttpErrorArray } from '../helper/http-error-utils';
import { BaseResponse } from '../../_interfaces/base-response';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  readonly #http = inject(HttpClient);

  public createTodo(todo: TodoDto): Observable<BaseResponse<number>> {
    return this.#http
      .post<BaseResponse<number>>(`${environment.apiBaseUrl}/${API_TODO_ENDPOINTS.todo}`, todo)
      .pipe(catchError(handleHttpError<number>()));
  }

  public updateTodo(todo: TodoDto): Observable<BaseResponse<boolean>> {
    return this.#http
      .patch<BaseResponse<boolean>>(`${environment.apiBaseUrl}/${API_TODO_ENDPOINTS.todo}`, todo)
      .pipe(catchError(handleHttpError<boolean>()));
  }

  public deleteTodo(todoId: number): Observable<BaseResponse<boolean>> {
    return this.#http
      .delete<
        BaseResponse<boolean>
      >(`${environment.apiBaseUrl}/${API_TODO_ENDPOINTS.todo}/?todoId=${todoId}`)
      .pipe(catchError(handleHttpError<boolean>()));
  }

  public getTodo(todoId: number): Observable<BaseResponse<TodoDto>> {
    return this.#http
      .get<
        BaseResponse<TodoDto>
      >(`${environment.apiBaseUrl}/${API_TODO_ENDPOINTS.todo}/?todoId=${todoId}`)
      .pipe(catchError(handleHttpError<TodoDto>()));
  }

  public getAllTodos(): Observable<BaseResponse<TodoDto[]>> {
    return this.#http.get<BaseResponse<TodoDto[]>>(
      `${environment.apiBaseUrl}/${API_TODO_ENDPOINTS.todos}`
    );
    // .pipe(catchError(handleHttpErrorArray<TodoDto>()));
  }
}
