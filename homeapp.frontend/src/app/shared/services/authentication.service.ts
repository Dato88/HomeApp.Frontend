import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserForRegistrationDto } from '../models/authentication/register/user-for-registration-dto';
import { RegistrationResponseDto } from '../models/authentication/register/registration-response-dto';
import { EnvironmentUrlService } from './environment-url.service';
import { UserForAuthenticationDto } from '../models/authentication/auth/user-for-authentication-dto';
import { AuthResponseDto } from '../models/authentication/auth/auth-response-dto';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();

  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService
  ) {}

  public registerUser = (route: string, body: UserForRegistrationDto) => {
    return this.http.post<RegistrationResponseDto>(this.createCompleteRoute(route, this.envUrl.urlAdress), body);
  };

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  };

  public createCompleteRoute = (route: string, envAdress: string) => {
    return `${envAdress}/${route}`;
  };

  public loginUser = (route: string, body: UserForAuthenticationDto) => {
    return this.http.post<AuthResponseDto>(this.createCompleteRoute(route, this.envUrl.urlAdress), body);
  };

  public logout = () => {
    localStorage.removeItem('token');
    this.sendAuthStateChangeNotification(false);
  };
}
