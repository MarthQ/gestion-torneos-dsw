import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, PaginatedApiResponse } from '@shared/interfaces/api-response';
import { QueryFilter } from '@shared/interfaces/filters';
import { User, UserFormDTO } from '@shared/interfaces/user';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  // Without pagination
  getUsers(): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(`${environment.apiUrl}/users`)
      .pipe(map((response) => response.data));
  }

  getUsersPaginated(
    query?: string,
    queryFilters?: QueryFilter,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PaginatedApiResponse<User>> {
    const params: any = { page, pageSize };

    if (query) params.query = query;
    if (queryFilters?.location) params.location = queryFilters.location.id;
    if (queryFilters?.role) params.role = queryFilters.role.id;

    return this.http
      .get<PaginatedApiResponse<User>>(`${environment.apiUrl}/users`, {
        params,
      })
      .pipe(
        map((response) => ({
          data: response.data,
          meta: response.meta,
          message: response.message,
        })),
      );
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/users/${userId}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error fetching user: ', error);
        return throwError(() => new Error(`No se pudo obtener el usuario`));
      }),
    );
  }

  addUser(newUser: UserFormDTO): Observable<UserFormDTO> {
    console.log(newUser);

    const { id, ...rest } = newUser;
    const body = id ? { id, ...rest } : rest;

    return this.http.post<ApiResponse<UserFormDTO>>(`${environment.apiUrl}/users`, body).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error adding user: ', error);
        return throwError(() => new Error(`No se pudo agregar el usuario`));
      }),
    );
  }

  updateUser(updatedUser: UserFormDTO): Observable<UserFormDTO> {
    const { id, ...body } = updatedUser;

    return this.http
      .patch<ApiResponse<UserFormDTO>>(`${environment.apiUrl}/users/${id}`, body)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error updating user: ', error);
          return throwError(() => new Error(`No se pudo modificar el usuario`));
        }),
      );
  }

  deleteUser(toBeDeletedUser: UserFormDTO): Observable<UserFormDTO> {
    const { id, ...rest } = toBeDeletedUser;

    return this.http.delete<ApiResponse<UserFormDTO>>(`${environment.apiUrl}/users/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error removing user: ', error);
        return throwError(() => new Error(`No se pudo borrar el usuario`));
      }),
    );
  }
}
