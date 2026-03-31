import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Tag } from '@shared/interfaces/tag';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private http = inject(HttpClient);

  // Without pagination
  getTags(): Observable<Tag[]> {
    return this.http
      .get<ApiResponse<Tag[]>>(`${environment.apiUrl}/tags`)
      .pipe(map((response) => response.data));
  }

  getTagsPaginated(
    query?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PaginatedApiResponse<Tag>> {
    const params: any = { page, pageSize };
    if (query) params.query = query;

    return this.http
      .get<PaginatedApiResponse<Tag>>(`${environment.apiUrl}/tags`, {
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

  addTag(newTag: Omit<Tag, 'id'>): Observable<Tag> {
    return this.http.post<ApiResponse<Tag>>(`${environment.apiUrl}/tags`, newTag).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error adding tag: ', error);
        return throwError(() => new Error(`No se pudo agregar la etiqueta`));
      }),
    );
  }

  updateTag(updatedTag: Tag): Observable<Tag> {
    const { id, ...body } = updatedTag;

    return this.http.patch<ApiResponse<Tag>>(`${environment.apiUrl}/tags/${id}`, body).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error updating tag: ', error);
        return throwError(() => new Error(`No se pudo modificar la etiqueta`));
      }),
    );
  }

  deleteTag(toBeDeletedTag: Pick<Tag, 'id'>): Observable<Tag> {
    return this.http.delete<ApiResponse<Tag>>(`${environment.apiUrl}/tags/${toBeDeletedTag.id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error removing tag: ', error);
        return throwError(() => new Error(`No se pudo borrar la etiqueta`));
      }),
    );
  }
}
