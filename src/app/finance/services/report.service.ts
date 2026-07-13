import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../../core/models';
import { handleHttpError } from '../../shared/services/helper/http-error-utils';
import { API_FINANCE_ENDPOINTS } from '../constants/api-endpoints';
import { EvaReportFilter, EvaReportResponse } from '../+state/models';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  readonly #http = inject(HttpClient);
  readonly #evaUrl = `${environment.apiBaseUrl}/${API_FINANCE_ENDPOINTS.reportEva}`;

  public getEvaReport(filter: EvaReportFilter): Observable<Result<EvaReportResponse>> {
    let params = new HttpParams().set('year', filter.year);

    for (const householdId of filter.householdIds) {
      params = params.append('householdIds', householdId);
    }

    return this.#http
      .get<Result<EvaReportResponse>>(this.#evaUrl, { params })
      .pipe(catchError(handleHttpError<EvaReportResponse>()));
  }
}
