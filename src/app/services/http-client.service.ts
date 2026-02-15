import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private baseUrl: string = environment.apiUrl;
  

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  // Set base URL dynamically
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  // GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`)
      .pipe(
        retry(1),
        catchError(error => {
          return this.handleError(error);
        })
      );
  }

  // POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data)
      .pipe(
        catchError(error => {
          return this.handleError(error);
        })
      );
  }

  // PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data)
      .pipe(
        catchError(error => {
          return this.handleError(error);
        })
      );
  }

  // DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`)
      .pipe(
        catchError(error => {
          return this.handleError(error);
        })
      );
  }

  // GET request with query parameters
  getWithParams<T>(endpoint: string, params: { [key: string]: any }): Observable<T> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key].toString());
      }
    });

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params: httpParams })
      .pipe(
        retry(1),
        catchError(error => {
          return this.handleError(error);
        })
      );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;

      // Handle specific status codes
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message;
          break;
        case 401:
          errorMessage = error.error?.message;
          break;
        case 403:
          errorMessage = 'Forbidden: Access denied';
          break;
        case 404:
          errorMessage = 'Not Found: Resource not available';
          break;
        case 500:
          errorMessage = 'Internal Server Error: ' + (error.error?.message);
          break;
      }
    }

    console.error(errorMessage);
    this.toastrService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
