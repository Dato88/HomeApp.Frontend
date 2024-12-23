import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserForRegistrationDto } from '../_interfaces/authentication/auth/register/user-for-registration-dto';
import { RegistrationResponseDto } from '../_interfaces/authentication/auth/register/registration-response-dto';
import { UserForAuthenticationDto } from '../_interfaces/authentication/auth/user-for-authentication-dto';
import { AuthResponseDto } from '../_interfaces/authentication/auth/auth-response-dto';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ForgotPasswordDto } from '../_interfaces/authentication/auth/resetPassword/forgot-password-dto';
import { ResetPasswordDto } from '../_interfaces/authentication/auth/resetPassword/reset-password-dto';
import { CustomEncoder } from '../custom-encoder';
import { TwoFactorDto } from '../_interfaces/authentication/auth/twoFactor/two-factor-dto';
import { environment } from '../../../environments/environment';
import { API_ACCOUNTS_ENDPOINTS } from '../../../api-endpoints/api-accounts-endpoints';
import { API_AUTHENTICATION_ENDPOINTS } from '../../../api-endpoints/api-authentication-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  readonly #http = inject(HttpClient);
  readonly #jwtHelper = inject(JwtHelperService);

  private authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();

  public registerUser = (body: UserForRegistrationDto) => {
    return this.#http.post<RegistrationResponseDto>(
      `${environment.backendUrl}/${API_ACCOUNTS_ENDPOINTS.register}`,
      body
    );
  };

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  };

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');

    const isAuthenticated: boolean = !!token && !this.#jwtHelper.isTokenExpired(token);

    return isAuthenticated;
  };

  public loginUser = (body: UserForAuthenticationDto) => {
    return this.#http.post<AuthResponseDto>(
      `${environment.backendUrl}/${API_AUTHENTICATION_ENDPOINTS.login}`,
      body
    );
  };

  public twoStepLogin = (body: TwoFactorDto) => {
    return this.#http.post<AuthResponseDto>(
      `${environment.backendUrl}/${API_AUTHENTICATION_ENDPOINTS.twoStepVerification}`,
      body
    );
  };

  public forgotPassword = (body: ForgotPasswordDto) => {
    return this.#http.post(
      `${environment.backendUrl}/${API_ACCOUNTS_ENDPOINTS.forgotPassword}`,
      body
    );
  };

  public resetPassword = (body: ResetPasswordDto) => {
    return this.#http.post(
      `${environment.backendUrl}/${API_ACCOUNTS_ENDPOINTS.resetPassword}`,
      body
    );
  };

  public confirmEmail = (token: string, email: string) => {
    let params = new HttpParams({ encoder: new CustomEncoder() });
    params = params.append('token', token);
    params = params.append('email', email);

    return this.#http.get(`${environment.backendUrl}/${API_ACCOUNTS_ENDPOINTS.emailConfirmation}`, {
      params: params,
    });
  };

  public logout = () => {
    localStorage.removeItem('token');
    this.sendAuthStateChangeNotification(false);
  };
}
