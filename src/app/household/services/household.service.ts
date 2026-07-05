import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../../core/models';
import { handleHttpError } from '../../shared/services/helper/http-error-utils';
import { API_HOUSEHOLD_ENDPOINTS } from '../constants/api-endpoints';
import {
  AddHouseholdMemberRequest,
  CreateHouseholdRequest,
  HouseholdResponse,
  RemoveHouseholdMemberRequest,
  RenameHouseholdRequest,
} from '../+state/models';

@Injectable({
  providedIn: 'root',
})
export class HouseholdService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = `${environment.apiBaseUrl}/${API_HOUSEHOLD_ENDPOINTS.household}`;
  readonly #memberUrl = `${environment.apiBaseUrl}/${API_HOUSEHOLD_ENDPOINTS.member}`;

  public getHouseholds(): Observable<Result<HouseholdResponse[]>> {
    return this.#http
      .get<Result<HouseholdResponse[]>>(this.#baseUrl)
      .pipe(catchError(handleHttpError<HouseholdResponse[]>()));
  }

  public createHousehold(request: CreateHouseholdRequest): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#baseUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public renameHousehold(request: RenameHouseholdRequest): Observable<Result<number>> {
    return this.#http
      .patch<Result<number>>(this.#baseUrl, null, {
        params: { householdId: request.householdId, name: request.name },
      })
      .pipe(catchError(handleHttpError<number>()));
  }

  public deleteHousehold(householdId: number): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#baseUrl, { params: { householdId } })
      .pipe(catchError(handleHttpError<number>()));
  }

  public addMember(request: AddHouseholdMemberRequest): Observable<Result<number>> {
    return this.#http
      .post<Result<number>>(this.#memberUrl, request)
      .pipe(catchError(handleHttpError<number>()));
  }

  public removeMember(request: RemoveHouseholdMemberRequest): Observable<Result<number>> {
    return this.#http
      .delete<Result<number>>(this.#memberUrl, {
        params: { householdId: request.householdId, personId: request.personId },
      })
      .pipe(catchError(handleHttpError<number>()));
  }
}
