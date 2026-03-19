import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User, UserFormDTO, UserFormLogin, UserRegisterDTO } from '@shared/interfaces/user';
import { authResponse } from '@shared/interfaces/auth-response';
import { catchError, EMPTY, map, Observable, ObservedValuesFromArray, subscribeOn, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  public isAdminSignal = signal<boolean>(false);

  register(userData: UserRegisterDTO): Observable<User>{
    const { mail, ...rest } = userData;
    const body = mail ? { mail, ...rest } : rest;
    return this.http.post<ApiResponse<User>>(`${environment.apiUrl}/register/`, body).pipe(
    map(response => response.data), 
    catchError(error => {
      console.error('Error en registro:', error);
      return throwError(() => new Error('No se pudo completar el registro'));
    })
  );
  }

  login(userData: UserFormLogin) {
    const { mail, ...rest } = userData;
    const body = mail? { mail, ...rest } : rest;
    console.log(userData);
    return this.http.post<authResponse>(`${environment.apiUrl}/login`,body).pipe(
      tap((res: authResponse) => {
        if (res && res.data) {
        localStorage.setItem('access_token', res.data)};
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = 'Error desconocido';
      if (error.status === 401 || error.status === 404) {
        errorMsg = 'Usuario no registrado o datos incorrectos';
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  };
  checkStatus() {
  const headers = new HttpHeaders({authorization: 'Bearer ' + String(localStorage.getItem('access_token')) })
  this.http.get(`${environment.apiUrl}/login/check/`, {headers, observe: 'response'}).subscribe({
    next: (data) => {
      console.log(data.status);
      this.isAdminSignal.set(data.status===200);
      console.log(data.status);
    },error: () => {
      this.isAdminSignal.set(false);
    }
  });
  }
}
