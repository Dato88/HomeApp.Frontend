import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { vi } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([])), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check auth status', () => {
    service.checkStatus().subscribe((status) => {
      expect(status.authenticated).toBe(true);
    });

    const req = httpTesting.expectOne('/auth/status');
    expect(req.request.method).toBe('GET');
    req.flush({ authenticated: true });
  });

  it('should redirect to the proxied login endpoint', () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign, pathname: '/dashboard' });

    service.login();

    expect(assign).toHaveBeenCalledWith('/auth/login');
    vi.unstubAllGlobals();
  });

  it('should not redirect when already on an auth route', () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign, pathname: '/auth/login' });

    service.login();

    expect(assign).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
