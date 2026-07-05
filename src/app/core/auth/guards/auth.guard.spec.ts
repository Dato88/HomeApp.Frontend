import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

function runGuard(): Observable<boolean> {
  return TestBed.runInInjectionContext(() => authGuard({} as never, {} as never)) as Observable<
    boolean
  >;
}

describe('authGuard', () => {
  it('should allow navigation when authenticated', async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            checkStatus: () => of({ authenticated: true }),
            login: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    const result = await firstValueFrom(runGuard());

    expect(result).toBe(true);
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should start login when not authenticated', async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            checkStatus: () => of({ authenticated: false }),
            login: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    const result = await firstValueFrom(runGuard());

    expect(authService.login).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should start login when status check fails', async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            checkStatus: () => throwError(() => new Error('network error')),
            login: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    const result = await firstValueFrom(runGuard());

    expect(authService.login).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
