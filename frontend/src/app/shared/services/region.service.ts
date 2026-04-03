import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Region } from '@shared/interfaces/region';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RegionService {
  private http = inject(HttpClient);

  // Without pagination
  getRegions(): Observable<Region[]> {
    return this.http
      .get<ApiResponse<Region[]>>(`${environment.apiUrl}/regions`)
      .pipe(map((response) => response.data));
  }

  getRegionsPaginated(
    query?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PaginatedApiResponse<Region>> {
    const params: any = { page, pageSize };
    if (query) params.query = query;

    return this.http
      .get<PaginatedApiResponse<Region>>(`${environment.apiUrl}/regions`, {
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

  addRegion(newRegion: Omit<Region, 'id'>): Observable<Region> {
    return this.http.post<ApiResponse<Region>>(`${environment.apiUrl}/regions`, newRegion).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error adding region: ', error);
        return throwError(() => error.error.message);
      }),
    );
  }

  updateRegion(updatedRegion: Region): Observable<Region> {
    const { id, ...body } = updatedRegion;

    return this.http.patch<ApiResponse<Region>>(`${environment.apiUrl}/regions/${id}`, body).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error updating region: ', error);
        return throwError(() => error.error.message);
      }),
    );
  }

  deleteRegion(toBeDeletedRegion: Pick<Region, 'id'>): Observable<Region> {
    return this.http
      .delete<ApiResponse<Region>>(`${environment.apiUrl}/locations/${toBeDeletedRegion.id}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error removing location: ', error);
          return throwError(() => error.error.message);
        }),
      );
  }
}
