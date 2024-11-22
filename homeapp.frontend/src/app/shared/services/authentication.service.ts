import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserForRegistrationDto } from '../models/authentication/register/user-for-registration-dto';
import { RegistrationResponseDto } from '../models/authentication/register/registration-response-dto';
import { EnvironmentUrlService } from './environment-url.service';
import { UserForAuthenticationDto } from '../models/authentication/auth/user-for-authentication-dto';
import { AuthResponseDto } from '../models/authentication/auth/auth-response-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService
  ) {}

  public registerUser = (route: string, body: UserForRegistrationDto) => {
    return this.http.post<RegistrationResponseDto>(
      this.createCompleteRoute(route, this.envUrl.urlAdress),
      body
    );
  };

  public createCompleteRoute = (route: string, envAdress: string) => {
    return `${envAdress}/${route}`;
  };

  public loginUser = (route: string, body: UserForAuthenticationDto) => {
    return this.http.post<AuthResponseDto>(
      this.createCompleteRoute(route, this.envUrl.urlAdress),
      body
    );
  };
}
