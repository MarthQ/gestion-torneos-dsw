import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Location } from '@shared/interfaces/location';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private http = inject(HttpClient);

  // Without pagination
  getLocations(): Observable<Location[]> {
    return this.http
      .get<ApiResponse<Location[]>>(`${environment.apiUrl}/locations`)
      .pipe(map((response) => response.data));
  }

  getLocationsPaginated(
    query?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PaginatedApiResponse<Location>> {
    const params: any = { page, pageSize };
    if (query) params.query = query;

    return this.http
      .get<PaginatedApiResponse<Location>>(`${environment.apiUrl}/locations`, {
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

  addLocation(newLocation: Omit<Location, 'id'>): Observable<Location> {
    return this.http
      .post<ApiResponse<Location>>(`${environment.apiUrl}/locations`, newLocation)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error adding location: ', error);
          return throwError(() => error.error.message);
        }),
      );
  }

  updateLocation(updatedLocation: Location): Observable<Location> {
    const { id, ...body } = updatedLocation;

    return this.http
      .patch<ApiResponse<Location>>(`${environment.apiUrl}/locations/${id}`, body)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error updating location: ', error);
          return throwError(() => error.error.message);
        }),
      );
  }

  deleteLocation(toBeDeletedLocation: Pick<Location, 'id'>): Observable<Location> {
    return this.http
      .delete<ApiResponse<Location>>(`${environment.apiUrl}/locations/${toBeDeletedLocation.id}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error removing location: ', error);
          return throwError(() => error.error.message);
        }),
      );
  }
}
