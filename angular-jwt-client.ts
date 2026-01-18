// ============================================
// 1. AUTH SERVICE (src/app/services/auth.service.ts)
// ============================================
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const token = this.getToken();
    if (token) {
      this.loadUserProfile();
    }
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      username,
      email,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
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

  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/profile`);
  }

  updateProfile(username: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, { username }).pipe(
      tap((response: any) => {
        this.currentUserSubject.next(response.user);
      })
    );
  }

  refreshToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {}).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  private loadUserProfile(): void {
    this.getProfile().subscribe({
      next: (response) => this.currentUserSubject.next(response.user),
      error: () => this.logout()
    });
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

// ============================================
// 2. HTTP INTERCEPTOR (src/app/interceptors/auth.interceptor.ts)
// ============================================
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

// ============================================
// 3. AUTH GUARD (src/app/guards/auth.guard.ts)
// ============================================
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// ============================================
// 4. APP CONFIG (src/app/app.config.ts)
// ============================================
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

// ============================================
// 5. ROUTES (src/app/app.routes.ts)
// ============================================
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  }
];

// ============================================
// 6. LOGIN COMPONENT (src/app/components/login/login.component.ts)
// ============================================
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control" />
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <div class="error">Email is required</div>
            }
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-control" />
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <div class="error">Password is required</div>
            }
          </div>

          @if (errorMessage) {
            <div class="alert alert-error">{{ errorMessage }}</div>
          }

          <button type="submit" [disabled]="loginForm.invalid || loading" class="btn-primary">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <p class="auth-link">
          Don't have an account? <a routerLink="/register">Register</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 { margin-bottom: 1.5rem; text-align: center; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .error { color: #d32f2f; font-size: 0.875rem; margin-top: 0.25rem; }
    .alert { padding: 0.75rem; margin-bottom: 1rem; border-radius: 4px; }
    .alert-error { background: #ffebee; color: #c62828; }
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    .btn-primary:hover:not(:disabled) { background: #1565c0; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-link { text-align: center; margin-top: 1rem; }
    .auth-link a { color: #1976d2; text-decoration: none; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Login failed';
          this.loading = false;
        }
      });
    }
  }
}

// ============================================
// 7. REGISTER COMPONENT (src/app/components/register/register.component.ts)
// ============================================
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" formControlName="username" class="form-control" />
            @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
              <div class="error">Username is required</div>
            }
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control" />
            @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
              <div class="error">Valid email is required</div>
            }
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-control" />
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <div class="error">Password must be at least 6 characters</div>
            }
          </div>

          @if (errorMessage) {
            <div class="alert alert-error">{{ errorMessage }}</div>
          }

          <button type="submit" [disabled]="registerForm.invalid || loading" class="btn-primary">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <p class="auth-link">
          Already have an account? <a routerLink="/login">Login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 { margin-bottom: 1.5rem; text-align: center; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .error { color: #d32f2f; font-size: 0.875rem; margin-top: 0.25rem; }
    .alert { padding: 0.75rem; margin-bottom: 1rem; border-radius: 4px; }
    .alert-error { background: #ffebee; color: #c62828; }
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    .btn-primary:hover:not(:disabled) { background: #1565c0; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-link { text-align: center; margin-top: 1rem; }
    .auth-link a { color: #1976d2; text-decoration: none; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      const { username, email, password } = this.registerForm.value;
      
      this.authService.register(username!, email!, password!).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Registration failed';
          this.loading = false;
        }
      });
    }
  }
}

// ============================================
// 8. DASHBOARD COMPONENT (src/app/components/dashboard/dashboard.component.ts)
// ============================================
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <nav class="navbar">
        <h1>Dashboard</h1>
        <div class="nav-links">
          <a routerLink="/profile">Profile</a>
          <button (click)="logout()" class="btn-logout">Logout</button>
        </div>
      </nav>

      <div class="content">
        @if (currentUser$ | async; as user) {
          <div class="welcome-card">
            <h2>Welcome, {{ user.username }}!</h2>
            <p>Email: {{ user.email }}</p>
            <p>This is a protected route. Only authenticated users can see this.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: #f5f5f5; }
    .navbar {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-links { display: flex; gap: 1rem; align-items: center; }
    .nav-links a {
      color: #1976d2;
      text-decoration: none;
      padding: 0.5rem 1rem;
    }
    .btn-logout {
      padding: 0.5rem 1rem;
      background: #d32f2f;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .content { padding: 2rem; }
    .welcome-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      max-width: 600px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  ngOnInit(): void {
    this.authService.getProfile().subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}