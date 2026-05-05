import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Role } from '@shared/interfaces/role';
import { ApiResponse, PaginatedApiResponse } from '@shared/interfaces/api-response';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);

  // Without pagination
  getRoles(): Observable<Role[]> {
    return this.http
      .get<ApiResponse<Role[]>>(`${environment.apiUrl}/roles`)
      .pipe(map((response) => response.data));
  }

  getRolesPaginated(
    query?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PaginatedApiResponse<Role>> {
    const params: any = { page, pageSize };
    if (query) params.query = query;

    return this.http
      .get<PaginatedApiResponse<Role>>(`${environment.apiUrl}/roles`, {
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

  addRole(newRole: Omit<Role, 'id'>): Observable<Role> {
    return this.http.post<ApiResponse<Role>>(`${environment.apiUrl}/roles`, newRole).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error adding tag: ', error);
        return throwError(() => new Error(`No se pudo agregar el rol`));
      }),
    );
  }

  updateRole(updatedRole: Role): Observable<Role> {
    const { id, ...body } = updatedRole;

    return this.http.patch<ApiResponse<Role>>(`${environment.apiUrl}/roles/${id}`, body).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error updating role: ', error);
        return throwError(() => new Error(`No se pudo modificar el rol`));
      }),
    );
  }

  deleteRole(toBeDeletedRole: Pick<Role, 'id'>): Observable<Role> {
    return this.http
      .delete<ApiResponse<Role>>(`${environment.apiUrl}/roles/${toBeDeletedRole.id}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error removing role: ', error);
          return throwError(() => new Error(`No se pudo borrar el rol`));
        }),
      );
  }
}
