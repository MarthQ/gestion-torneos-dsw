import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, PaginatedApiResponse } from '@shared/interfaces/api-response';
import { QueryFilter } from '@shared/interfaces/filters';
import { Tournament, TournamentFormDTO } from '@shared/interfaces/tournament';
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
    if (queryFilters?.tag) params.tag = queryFilters.tag.id;
    if (queryFilters?.game) params.game = queryFilters.game.id;

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

  getTournament(tournamentId: number): Observable<Tournament> {
    return this.http
      .get<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments/${tournamentId}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => new Error(`No se encontró el torneo de id ${tournamentId}`));
        }),
      );
  }

  addTournament(newTournament: TournamentFormDTO): Observable<TournamentFormDTO> {
    const { id, ...rest } = newTournament;
    const body = id ? { id, ...rest } : rest;

    console.log(body);

    return this.http
      .post<ApiResponse<TournamentFormDTO>>(`${environment.apiUrl}/tournaments`, body)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => new Error(`No se pudo agregar el torneo`));
        }),
      );
  }

  updateTournament(updatedTournament: TournamentFormDTO): Observable<TournamentFormDTO> {
    const { id, ...body } = updatedTournament;

    console.log(body);

    return this.http
      .patch<ApiResponse<TournamentFormDTO>>(`${environment.apiUrl}/tournaments/${id}`, body)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => new Error(`No se pudo modificar el torneo`));
        }),
      );
  }

  deleteTournament(toBeDeletedTournament: TournamentFormDTO): Observable<TournamentFormDTO> {
    const { id, ...rest } = toBeDeletedTournament;

    return this.http
      .delete<ApiResponse<TournamentFormDTO>>(`${environment.apiUrl}/tournaments/${id}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => new Error(`No se pudo borrar el torneo`));
        }),
      );
  }

  startTournament(tournament: Tournament): Observable<ApiResponse<Tournament>> {
    return this.http
      .post<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments/${tournament.id}/start`, {})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(
            () => new Error(`No se pudo comenzar el torneo. Razón: ${error.error.message}`),
          );
        }),
      );
  }
}
