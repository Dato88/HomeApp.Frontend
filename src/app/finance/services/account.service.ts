import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../../core/models';
import { handleHttpError } from '../../shared/services/helper/http-error-utils';
import { API_FINANCE_ENDPOINTS } from '../constants/api-endpoints';
import {
  AccountDto,
  CreateAccountRequest,
  ShareAccountRequest,
  UpdateAccountRequest,
} from '../+state/models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${environment.apiBaseUrl}/${API_FINANCE_ENDPOINTS.account}`;
  readonly #shareUrl = `${environment.apiBaseUrl}/${API_FINANCE_ENDPOINTS.accountShare}`;

  public getAccounts(): Observable<Result<AccountDto[]>> {
    return this.#http
      .get<Result<AccountDto[]>>(this.#baseUrl)
      .pipe(catchError(handleHttpError<AccountDto[]>()));
  }

  public createAccount(request: CreateAccountRequest): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#baseUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public updateAccount(request: UpdateAccountRequest): Observable<Result<number>> {
    return this.#http
      .patch<Result<number>>(this.#baseUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public deleteAccount(accountId: number): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#baseUrl, { params: { accountId } })
      .pipe(catchError(handleHttpError<number>()));
  }

  public shareAccount(request: ShareAccountRequest): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#shareUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public unshareAccount(request: ShareAccountRequest): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#shareUrl, {
        params: { accountId: request.accountId, householdId: request.householdId },
      })
      .pipe(catchError(handleHttpError<number>()));
  }
}
