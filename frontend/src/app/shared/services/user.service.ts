import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CrudAction } from '@shared/interfaces/crudAction';
import { QueryFilter } from '@shared/interfaces/filters';
import { User, UserFormDTO, UserUpdateDTO } from '@shared/interfaces/user';
import { ApiResponse, PaginatedApiResponse } from '@shared/interfaces/api-response';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.apiUrl;

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

  addUser(newUser: Omit<UserFormDTO, 'id'>): Observable<UserFormDTO> {
    return this.http.post<ApiResponse<UserFormDTO>>(`${environment.apiUrl}/users`, newUser).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error removing user: ', error);
        return throwError(() => error.error.message);
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
          return throwError(() => error.error.message);
        }),
      );
  }

  updateUserNonAdmin(updatedUser: UserUpdateDTO): Observable<UserUpdateDTO> {
    const { id, ...body } = updatedUser;
    return this.http
      .patch<ApiResponse<UserUpdateDTO>>(`${environment.apiUrl}/users/${id}/byUser`, body)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error updating user: ', error);
          return throwError(() => error);
        }),
      );
  }

  deleteUser(toBeDeletedUser: Pick<UserFormDTO, 'id'>): Observable<UserFormDTO> {
    return this.http
      .delete<ApiResponse<UserFormDTO>>(`${environment.apiUrl}/users/${toBeDeletedUser.id}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error removing user: ', error);
          return throwError(() => error.error.message);
        }),
      );
  }

  getUserById(userId: Number) {
    return this.http.get(`${baseUrl}/users/${userId}`);
  }

  sendInvitation(userId: number, path: string) {
    const params = { path };
    return this.http.get(`${baseUrl}/users/${userId}/invite`, { params }).pipe(
      catchError((error) => {
        console.log('Error removing user: ', error);
        return throwError(() => error.error.message);
      }),
    );
  }
}
