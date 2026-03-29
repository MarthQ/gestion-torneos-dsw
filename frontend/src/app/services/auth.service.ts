import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserFormLogin, UserRegisterDTO } from '@shared/interfaces/user';
import { authResponse } from '@shared/interfaces/auth-response';
import { catchError, EMPTY, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  public isAdminSignal = signal<boolean>(false);
  public isLogged = signal<boolean>(false);

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
    return this.http.post<authResponse>(`${environment.apiUrl}/login/`,body, {withCredentials: true}).pipe(
      tap(),catchError(error => {
        console.error('Error en el inicio de sesión', error);
        return throwError(()=>new Error('No se pudo iniciar sesión'));
      })
    );
  };
  
  checkStatus() {
  const headers = new HttpHeaders()
  this.http.get(`${environment.apiUrl}/login/admincheck/`, {headers, observe: 'response', withCredentials: true}).subscribe({
    next: (data) => {
      this.isAdminSignal.set(data.status===200);
    },error: () => {
      this.isAdminSignal.set(false);
    }
  });
  }
  
  checkLogin(){
  const headers = new HttpHeaders()
  this.http.get(`${environment.apiUrl}/login/check/`, {headers, observe: 'response', withCredentials: true}).subscribe({
    next: (data) => {
    this.isLogged.set(data.status===200);
    this.router.navigate(['/tournaments'])
    },error: () => {
      this.isLogged.set(false);
    }
  });
  }

  checkLogged(){
  const headers = new HttpHeaders()
  this.http.get(`${environment.apiUrl}/login/check/`, {headers, observe: 'response', withCredentials: true}).subscribe({
    next: (data) => {
    this.isLogged.set(data.status===200);
    },error: () => {
      this.isLogged.set(false);
      this.router.navigate(['/tournaments'])
    }
  });
  }
}
