import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@shared/interfaces/user';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AUTH_STATUS, AuthStatus } from '@features/auth/interfaces/auth-status.interface';
import { AuthResponse } from '@features/auth/interfaces/auth-response.interface';
import { RegisterForm } from '@features/auth/interfaces/register-form.interface';
import { Router } from '@angular/router';

const baseUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private _user = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AUTH_STATUS.CHECKING);

  user = computed<User | null>(() => this._user());
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === AUTH_STATUS.CHECKING) {
      return AUTH_STATUS.CHECKING;
    }
    if (this._user()) {
      return AUTH_STATUS.AUTHENTICATED;
    }

    return AUTH_STATUS.NOT_AUTHENTICATED;
  });

  //* Public Methods
  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        mail: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error)),
      );
  }

  register(registerForm: RegisterForm): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, registerForm).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error)),
    );
  }

  checkAuthStatus(): Observable<boolean> {
    // With HttpOnly cookies, we just check with the backend
    // No need to check local token first - cookies handle it automatically
    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
      map((resp) => {
        this.handleAuthSuccess(resp);
        return true;
      }),
      catchError(() => {
        // No hay cookie válida - usuario no autenticado, pero la app debe cargar
        this.clearLocalState();
        return of(false);
      }),
    );
  }

  logout() {
    // Call logout endpoint to clear cookie, then clean local state
    this.http.post(`${baseUrl}/auth/logout`, {}).subscribe({
      next: () => {
        this.clearLocalState();
      },
      error: () => {
        // Even if the server call fails, clear local state
        this.clearLocalState();
      },
    });
  }

  updateUserData(partialUser: Partial<User>) {
    const current = this._user();
    if (current) {
      this._user.set({ ...current, ...partialUser });
    }
  }

  private clearLocalState() {
    this._user.set(null);
    this._authStatus.set(AUTH_STATUS.NOT_AUTHENTICATED);
  }

  handleAuthSuccess(resp: AuthResponse): boolean {
    console.log(resp.message);
    const { user } = resp.data;
    this._user.set(user);
    this._authStatus.set(AUTH_STATUS.AUTHENTICATED);

    // No need to store token - HttpOnly cookie handles it

    return true;
  }

  handleAuthError(error: any) {
    this.clearLocalState();

    return throwError(() => error.error.message);
  }

  requestForgotPassword(mail: string) {
    const body = { mail };
    return this.http
      .post(`${baseUrl}/auth/forgot-password`, body)
      .pipe(catchError((error: any) => throwError(() => error.error.message)));
  }

  requestSetupPassword(password: string, mailToken: string): Observable<boolean> {
    const body = { password };
    const params = { mailToken };
    return this.http.post<AuthResponse>(`${baseUrl}/auth/setup-password`, body, { params }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => throwError(() => error.error.message)),
    );
  }
}
