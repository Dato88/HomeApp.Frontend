import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../../core/models';
import { handleHttpError } from '../../shared/services/helper/http-error-utils';
import { API_FINANCE_ENDPOINTS } from '../constants/api-endpoints';
import {
  MergePaymentPartnersRequest,
  PaymentPartnerDto,
  RenamePaymentPartnerRequest,
} from '../+state/models';

@Injectable({
  providedIn: 'root',
})
export class PaymentPartnerService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${environment.apiBaseUrl}/${API_FINANCE_ENDPOINTS.paymentPartner}`;
  readonly #mergeUrl = `${environment.apiBaseUrl}/${API_FINANCE_ENDPOINTS.paymentPartnerMerge}`;

  public getPaymentPartners(): Observable<Result<PaymentPartnerDto[]>> {
    return this.#http
      .get<Result<PaymentPartnerDto[]>>(this.#baseUrl)
      .pipe(catchError(handleHttpError<PaymentPartnerDto[]>()));
  }

  public renamePaymentPartner(
    request: RenamePaymentPartnerRequest
  ): Observable<Result<number>> {
    return this.#http
      .patch<Result<number>>(this.#baseUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public mergePaymentPartners(
    request: MergePaymentPartnersRequest
  ): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#mergeUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }
}
