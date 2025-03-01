import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_PERSON_ENDPOINTS } from '../../../api-endpoints/api-person-endpoints';
import { environment } from '../../../environments/environment';
import { BaseResponse } from '../../shared/_interfaces/base-response';
import { PersonDto } from '../models/person/person-dto';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  readonly #http = inject(HttpClient);

  public getUser(): Observable<PersonDto> {
    return this.#http
      .get<BaseResponse<PersonDto>>(`${environment.backendUrl}/${API_PERSON_ENDPOINTS.person}`)
      .pipe(map((response) => response.data));
  }
}
