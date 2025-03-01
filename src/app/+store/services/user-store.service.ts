import { HttpClient } from '@angular/common/http';
import { Injectable, inject, WritableSignal, signal } from '@angular/core';
import { API_NAVBAR_ENDPOINTS } from '../../../api-endpoints/api-navbar-endpoints';
import { API_PERSON_ENDPOINTS } from '../../../api-endpoints/api-person-endpoints';
import { environment } from '../../../environments/environment';
import { BaseResponse } from '../../shared/_interfaces/base-response';
import { NavbarItem } from '../../shared/_interfaces/navbar/navbar-item';
import { NavbarListItem } from '../../shared/_interfaces/navbar/navbar-list-item';
import { PersonDto } from '../../shared/_interfaces/person/person-dto';
import { debounceTime, map, Observable, tap } from 'rxjs';

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
