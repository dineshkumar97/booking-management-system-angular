import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import {
  Injectable,
  PLATFORM_ID,
  inject
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import {
  Observable,
  throwError
} from 'rxjs';

import {
  catchError,
  finalize
} from 'rxjs/operators';
import { LoaderService } from '../loader-service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private platformId = inject(PLATFORM_ID);

  constructor(
    private router: Router,
    private loaderService: LoaderService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.loaderService.show();

    let authReq = req;

    if (isPlatformBrowser(this.platformId)) {

      const jwt = window.sessionStorage.getItem('authToken');

      console.log('JWT:', jwt);

      // Check if request is FormData
      if (req.body instanceof FormData) {

        // DON'T set Content-Type
        authReq = req.clone({
          setHeaders: {
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
          }
        });

      } else {

        // Normal JSON request
        authReq = req.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
          }
        });
      }

    } else {

      // SSR
      authReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        if (
          isPlatformBrowser(this.platformId) &&
          (error.status === 401 || error.status === 403)
        ) {

          console.log('Token missing/expired');

          window.sessionStorage.removeItem('authToken');

          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      }),

      finalize(() => {
        this.loaderService.hide();
      })

    );
  }
}