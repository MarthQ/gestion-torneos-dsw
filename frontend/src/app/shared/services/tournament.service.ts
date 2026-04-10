import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { QueryFilter } from '@shared/interfaces/filters';
import { Tournament, TournamentFormDTO } from '@shared/interfaces/tournament';
import { ApiResponse, PaginatedApiResponse } from '@shared/interfaces/api-response';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private http = inject(HttpClient);
  private _bracketData = signal<any | null>(null);
  bracketData = computed(() => this._bracketData());

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

  getTournament(
    tournamentId: number,
  ): Observable<{ tournamentData: Tournament; bracketData: any }> {
    return this.http
      .get<
        ApiResponse<{ tournamentData: Tournament; bracketData: any }>
      >(`${environment.apiUrl}/tournaments/${tournamentId}`)
      .pipe(map((response) => response.data));
  }

  addTournament(newTournament: Omit<TournamentFormDTO, 'id'>): Observable<TournamentFormDTO> {
    return this.http
      .post<ApiResponse<TournamentFormDTO>>(`${environment.apiUrl}/tournaments`, newTournament)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => error.error.message);
        }),
      );
  }

  createTournament(newTournament: Omit<TournamentFormDTO, 'id'>): Observable<TournamentFormDTO> {
    return this.http
      .post<
        ApiResponse<TournamentFormDTO>
      >(`${environment.apiUrl}/tournaments/create`, newTournament)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => error.error.message);
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
          return throwError(() => error.error.message);
        }),
      );
  }

  deleteTournament(
    toBeDeletedTournament: Pick<TournamentFormDTO, 'id'>,
  ): Observable<TournamentFormDTO> {
    return this.http
      .delete<
        ApiResponse<TournamentFormDTO>
      >(`${environment.apiUrl}/tournaments/${toBeDeletedTournament.id}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => error.error.message);
        }),
      );
  }

  // Tournament detail with populated relations
  // getTournamentDetail(id: number): Observable<TournamentDetail> {
  //   return this.http
  //     .get<ApiResponse<TournamentDetail>>(`${environment.apiUrl}/tournaments/${id}`)
  //     .pipe(
  //       map((response) => response.data),
  //       catchError((error) => {
  //         console.error(error);
  //         return throwError(() => error.error?.message || 'Tournament not found');
  //       }),
  //     );
  // }

  // User's tournaments
  getUserTournaments(
    query?: string,
    queryFilters?: QueryFilter,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<Tournament[]> {
    const params: any = { page, pageSize };

    if (query) params.query = query;
    if (queryFilters?.location) params.location = queryFilters.location.id;
    if (queryFilters?.role) params.role = queryFilters.role.id;
    if (queryFilters?.game) params.game = queryFilters.game.id;
    return this.http
      .get<ApiResponse<Tournament[]>>(`${environment.apiUrl}/tournaments`, { params })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          return throwError(() => error.error?.message || 'Failed to fetch user tournaments');
        }),
      );
  }

  // Bracket operations
  getTournamentBracket(tournamentId: number): Observable<any> {
    return this.http
      .get<ApiResponse<any>>(`${environment.apiUrl}/tournaments/${tournamentId}/bracket`)
      .pipe(
        map((response) => {
          this._bracketData.set(response.data);
          return response.data;
        }),
        catchError((error) => {
          console.error(error);
          return throwError(() => error.error?.message || 'Bracket not found');
        }),
      );
  }

  reportMatchResult(tournamentId: number, matchId: number, score: string): Observable<any> {
    return this.http
      .post<
        ApiResponse<any>
      >(`${environment.apiUrl}/tournaments/${tournamentId}/match/${matchId}`, { score })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => error.error?.message || 'Failed to report match result');
        }),
      );
  }

  getStageMatches(stageId: number) {
    return this.http
      .get<ApiResponse<any>>(`${environment.apiUrl}/tournaments/${stageId}/matches`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => error.error?.message || 'Failed to get matches');
        }),
      );
  }

  //* Should this method be called "createBracket"?
  closeInscriptions(tournamentId: number): Observable<Tournament> {
    return this.http
      .post<ApiResponse<any>>(`${environment.apiUrl}/tournaments/${tournamentId}/close`, {})
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => error.error?.message || 'Failed to close inscriptions');
        }),
      );
  }

  startTournament(tournamentId: number): Observable<Tournament> {
    return this.http
      .post<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments/${tournamentId}/start`, {})
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => error.error?.message || 'Failed to start the tournament');
        }),
      );
  }

  endTournament(tournamentId: number): Observable<Tournament> {
    return this.http
      .post<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments/${tournamentId}/finish`, {})
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => error.error?.message || 'Failed to end the tournament');
        }),
      );
  }

  cancelTournament(tournamentId: number): Observable<Tournament> {
    return this.http
      .post<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments/${tournamentId}/cancel`, {})
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => error.error?.message || 'Failed to cancel the tournament');
        }),
      );
  }
}
