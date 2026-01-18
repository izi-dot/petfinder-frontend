import { Injectable } from "@angular/core";
import { HttpClientService } from "./http-client.service";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "../domains";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private httpClientService: HttpClientService, private router: Router) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.httpClientService.post<AuthResponse>(`/register`, request)
    .pipe(
      tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.httpClientService.post<AuthResponse>(`/login`, request)
    .pipe(
      tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<{ token: string }> {
    return this.httpClientService.post<{ token: string }>(`/refresh-token`, {})
    .pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}