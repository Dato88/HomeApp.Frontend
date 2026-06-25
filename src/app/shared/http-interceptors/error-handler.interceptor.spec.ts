import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';
import { errorHandlerInterceptor } from './error-handler.interceptor';

describe('errorHandlerInterceptor', () => {
  it('should navigate to 404 on not found errors', async () => {
    const navigate = vi.fn();
    const next = vi.fn(() =>
      throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }))
    );

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { navigate } }],
    });

    await expect(
      TestBed.runInInjectionContext(() =>
        firstValueFrom(errorHandlerInterceptor({} as never, next))
      )
    ).rejects.toThrow();

    expect(navigate).toHaveBeenCalledWith(['/404']);
  });

  it('should pass through successful responses', async () => {
    const next = vi.fn(() => of({ type: 4 }));

    const event = await TestBed.runInInjectionContext(() =>
      firstValueFrom(errorHandlerInterceptor({} as never, next))
    );

    expect(event).toEqual({ type: 4 });
  });
});
