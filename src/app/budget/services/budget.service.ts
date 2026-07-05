import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../../core/models';
import { handleHttpError } from '../../shared/services/helper/http-error-utils';
import { API_BUDGET_ENDPOINTS } from '../constants/api-endpoints';
import {
  BudgetResponse,
  CreateBudgetCellRequest,
  CreateBudgetGroupRequest,
  CreateBudgetRowRequest,
  EvaResponse,
  UpdateBudgetCellRequest,
  UpdateBudgetGroupRequest,
  UpdateBudgetRowRequest,
} from '../+state/models';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${environment.apiBaseUrl}/${API_BUDGET_ENDPOINTS.budget}`;
  readonly #evaUrl = `${environment.apiBaseUrl}/${API_BUDGET_ENDPOINTS.budgetEva}`;
  readonly #groupUrl = `${environment.apiBaseUrl}/${API_BUDGET_ENDPOINTS.budgetGroup}`;
  readonly #rowUrl = `${environment.apiBaseUrl}/${API_BUDGET_ENDPOINTS.budgetRow}`;
  readonly #cellUrl = `${environment.apiBaseUrl}/${API_BUDGET_ENDPOINTS.budgetCell}`;

  public getBudget(householdId: number, year: number): Observable<BudgetResponse | null> {
    return this.#http
      .get<Result<BudgetResponse>>(this.#baseUrl, {
        params: { householdId, year },
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<Result<BudgetResponse>>) => {
          if (response.status === 204) {
            return null;
          }

          const body = response.body;

          return body?.isSuccess ? body.value : null;
        }),
        catchError(() => of(null))
      );
  }

  public getEva(householdId: number, year: number): Observable<EvaResponse | null> {
    return this.#http
      .get<Result<EvaResponse>>(this.#evaUrl, {
        params: { householdId, year },
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<Result<EvaResponse>>) => {
          if (response.status === 204) {
            return null;
          }

          const body = response.body;

          return body?.isSuccess ? body.value : null;
        }),
        catchError(() => of(null))
      );
  }

  public createBudget(householdId: number, year: number): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#baseUrl, null, { params: { householdId, year } })
      .pipe(catchError(handleHttpError<number>()));
  }

  public deleteBudget(budgetId: number): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#baseUrl, { params: { budgetId } })
      .pipe(catchError(handleHttpError<number>()));
  }

  public createGroup(request: CreateBudgetGroupRequest): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#groupUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public updateGroup(request: UpdateBudgetGroupRequest): Observable<Result<number>> {
    return this.#http
      .patch<Result<number>>(this.#groupUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public deleteGroup(budgetGroupId: number): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#groupUrl, { params: { budgetGroupId } })
      .pipe(catchError(handleHttpError<number>()));
  }

  public createRow(request: CreateBudgetRowRequest): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#rowUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public updateRow(request: UpdateBudgetRowRequest): Observable<Result<number>> {
    return this.#http
      .patch<Result<number>>(this.#rowUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public deleteRow(budgetRowId: number): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#rowUrl, { params: { budgetRowId } })
      .pipe(catchError(handleHttpError<number>()));
  }

  public createCell(request: CreateBudgetCellRequest): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#cellUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public updateCell(request: UpdateBudgetCellRequest): Observable<Result<number>> {
    return this.#http
      .patch<Result<number>>(this.#cellUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public deleteCell(budgetCellId: number): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#cellUrl, { params: { budgetCellId } })
      .pipe(catchError(handleHttpError<number>()));
  }
}
