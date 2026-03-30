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
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _authStatus = signal<AuthStatus>(AUTH_STATUS.CHECKING);

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());
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
    if (!this._token()) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error)),
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set(AUTH_STATUS.NOT_AUTHENTICATED);

    localStorage.removeItem('token');
  }

  handleAuthSuccess(resp: AuthResponse): boolean {
    console.log(resp.message);
    const { user, token } = resp.data;
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set(AUTH_STATUS.AUTHENTICATED);

    localStorage.setItem('token', token);

    return true;
  }

  handleAuthError(error: any) {
    this.logout();

    return throwError(() => error.error.message);
  }
}
