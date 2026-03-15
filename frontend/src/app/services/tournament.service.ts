import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryFilter } from '@shared/interfaces/filters';
import { Tournament } from '@shared/interfaces/tournament';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private http = inject(HttpClient);

  // Without pagination
  getTournaments(): Observable<Tournament[]> {
    return this.http
      .get<ApiResponse<Tournament[]>>(`${environment.apiUrl}/tournaments`)
      .pipe(map((response) => response.data));
  }

  getTournamentsPaginated(
    query?: string,
    queryFilters?: QueryFilter,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PaginatedApiResponse<Tournament>> {
    const params: any = { page, pageSize };

    if (query) params.query = query;
    if (queryFilters?.location) params.location = queryFilters.location.id;
    if (queryFilters?.role) params.role = queryFilters.role.id;

    return this.http
      .get<PaginatedApiResponse<Tournament>>(`${environment.apiUrl}/tournaments`, {
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

  addTournament(newTournament: Tournament): Observable<Tournament> {
    const { id, ...rest } = newTournament;
    const body = id ? { id, ...rest } : rest;

    console.log(body);

    return this.http.post<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments`, body).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error adding tournament: ', error);
        return throwError(() => new Error(`No se pudo agregar el usuario`));
      }),
    );
  }

  updateTournament(updatedTournament: Tournament): Observable<Tournament> {
    const { id, ...body } = updatedTournament;

    return this.http
      .patch<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments/${id}`, body)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error updating tournament: ', error);
          return throwError(() => new Error(`No se pudo modificar el torneo`));
        }),
      );
  }

  deleteTournament(toBeDeletedTournament: Tournament): Observable<Tournament> {
    const { id, ...rest } = toBeDeletedTournament;

    return this.http
      .delete<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments/${id}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.log('Error removing tournament: ', error);
          return throwError(() => new Error(`No se pudo borrar el torneo`));
        }),
      );
  }
}
