import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const newReq = req.clone({
    withCredentials: true,
  });

  return next(newReq);
}
