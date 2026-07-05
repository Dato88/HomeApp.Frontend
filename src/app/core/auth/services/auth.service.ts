import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthStatus } from '../models/auth-status';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #http = inject(HttpClient);

  public checkStatus(): Observable<AuthStatus> {
    return this.#http.get<AuthStatus>(`${environment.authBaseUrl}/status`);
  }

  public login(): void {
    if (window.location.pathname.startsWith('/auth/')) {
      return;
    }

    window.location.assign(`${environment.authBaseUrl}/login`);
  }

  public logout(): void {
    window.location.assign(`${environment.authBaseUrl}/logout`);
  }
}
