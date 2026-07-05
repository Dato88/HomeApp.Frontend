import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_NAVBAR_ENDPOINTS } from '../../../api-endpoints/api-navbar-endpoints';
import { environment } from '../../../environments/environment';
import { NavbarListItem } from '../models/navbar/navbar-list-item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarStoreService {
  readonly #http = inject(HttpClient);

  public getNavbarItems(): Observable<NavbarListItem[]> {
    return this.#http.get<NavbarListItem[]>(
      `${environment.apiBaseUrl}/${API_NAVBAR_ENDPOINTS.navbar}`
    );
  }

  public getNavbarResource() {
    return rxResource({
      stream: () => this.getNavbarItems(),
    });
  }
}
