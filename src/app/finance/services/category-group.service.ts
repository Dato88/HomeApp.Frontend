import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../../core/models';
import { handleHttpError } from '../../shared/services/helper/http-error-utils';
import { API_FINANCE_ENDPOINTS } from '../constants/api-endpoints';
import {
  CategoryGroupDto,
  CreateCategoryGroupRequest,
  UpdateCategoryGroupRequest,
} from '../+state/models';

@Injectable({
  providedIn: 'root',
})
export class CategoryGroupService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${environment.apiBaseUrl}/${API_FINANCE_ENDPOINTS.categoryGroup}`;

  public getCategoryGroups(householdId: number): Observable<Result<CategoryGroupDto[]>> {
    return this.#http
      .get<Result<CategoryGroupDto[]>>(this.#baseUrl, { params: { householdId } })
      .pipe(catchError(handleHttpError<CategoryGroupDto[]>()));
  }

  public createCategoryGroup(request: CreateCategoryGroupRequest): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#baseUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public updateCategoryGroup(request: UpdateCategoryGroupRequest): Observable<Result<number>> {
    return this.#http
      .patch<Result<number>>(this.#baseUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public deleteCategoryGroup(categoryGroupId: number): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#baseUrl, { params: { categoryGroupId } })
      .pipe(catchError(handleHttpError<number>()));
  }
}
