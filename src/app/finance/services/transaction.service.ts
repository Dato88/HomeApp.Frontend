import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../../core/models';
import { handleHttpError } from '../../shared/services/helper/http-error-utils';
import { API_FINANCE_ENDPOINTS } from '../constants/api-endpoints';
import {
  CreateTransactionRequest,
  ImportTransactionsRequest,
  ImportTransactionsResponse,
  SetTransactionCategoryRequest,
  TransactionFilter,
  TransactionListResponse,
  UpdateTransactionRequest,
} from '../+state/models';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${environment.apiBaseUrl}/${API_FINANCE_ENDPOINTS.transaction}`;
  readonly #importUrl = `${environment.apiBaseUrl}/${API_FINANCE_ENDPOINTS.transactionImport}`;
  readonly #categoryUrl = `${environment.apiBaseUrl}/${API_FINANCE_ENDPOINTS.transactionCategory}`;

  public getTransactions(
    filter: TransactionFilter
  ): Observable<Result<TransactionListResponse>> {
    let params = new HttpParams()
      .set('accountId', filter.accountId)
      .set('page', filter.page)
      .set('pageSize', filter.pageSize);

    if (filter.from) {
      params = params.set('from', filter.from);
    }

    if (filter.to) {
      params = params.set('to', filter.to);
    }

    if (filter.categoryId != null) {
      params = params.set('categoryId', filter.categoryId);
    }

    if (filter.uncategorized != null) {
      params = params.set('uncategorized', filter.uncategorized);
    }

    return this.#http
      .get<Result<TransactionListResponse>>(this.#baseUrl, { params })
      .pipe(catchError(handleHttpError<TransactionListResponse>()));
  }

  public createTransaction(request: CreateTransactionRequest): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#baseUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public updateTransaction(request: UpdateTransactionRequest): Observable<Result<number>> {
    return this.#http
      .patch<Result<number>>(this.#baseUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public deleteTransaction(transactionId: number): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#baseUrl, { params: { transactionId } })
      .pipe(catchError(handleHttpError<number>()));
  }

  public setCategory(request: SetTransactionCategoryRequest): Observable<Result<number>> {
    return this.#http
      .patch<Result<number>>(this.#categoryUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public importTransactions(
    request: ImportTransactionsRequest
  ): Observable<Result<ImportTransactionsResponse>> {
    const formData = new FormData();
    formData.append('file', request.file);

    let params = new HttpParams().set('accountId', request.accountId);

    if (request.format) {
      params = params.set('format', request.format);
    }

    return this.#http
      .post<Result<ImportTransactionsResponse>>(this.#importUrl, formData, { params })
      .pipe(catchError(handleHttpError<ImportTransactionsResponse>()));
  }
}
