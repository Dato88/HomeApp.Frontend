import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../../core/models';
import { handleHttpError } from '../../shared/services/helper/http-error-utils';
import { API_FINANCE_ENDPOINTS } from '../constants/api-endpoints';
import {
  CategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../+state/models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${environment.apiBaseUrl}/${API_FINANCE_ENDPOINTS.category}`;

  public getCategories(householdId: number): Observable<Result<CategoryDto[]>> {
    return this.#http
      .get<Result<CategoryDto[]>>(this.#baseUrl, { params: { householdId } })
      .pipe(catchError(handleHttpError<CategoryDto[]>()));
  }

  public createCategory(request: CreateCategoryRequest): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#baseUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public updateCategory(request: UpdateCategoryRequest): Observable<Result<number>> {
    return this.#http
      .patch<Result<number>>(this.#baseUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public deleteCategory(categoryId: number): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#baseUrl, { params: { categoryId } })
      .pipe(catchError(handleHttpError<number>()));
  }
}
