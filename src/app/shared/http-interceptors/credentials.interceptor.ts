import { HttpInterceptorFn } from '@angular/common/http';

function isBffRequest(url: string): boolean {
  return url.startsWith('/api') || url.startsWith('/auth');
}

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isBffRequest(req.url)) {
    return next(req);
  }

  return next(
    req.clone({
      withCredentials: true,
    })
  );
};
