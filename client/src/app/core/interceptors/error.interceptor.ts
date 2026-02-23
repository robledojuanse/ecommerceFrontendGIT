import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMsg = 'An unknown error occurred!';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMsg = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                errorMsg = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
            }

            console.error('[Error Interceptor]', errorMsg);
            // In a real app, you might use a ToastService or Snackbar here
            alert(`Oops! Something went wrong:\n${errorMsg}`);

            return throwError(() => new Error(errorMsg));
        })
    );
};
