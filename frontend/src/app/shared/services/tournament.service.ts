import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { QueryFilter } from '@shared/interfaces/filters';
import { Tournament, TournamentFormDTO } from '@shared/interfaces/tournament';
import { ApiResponse, PaginatedApiResponse } from '@shared/interfaces/api-response';
import { catchError, firstValueFrom, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Toaster } from '@shared/utils/toaster';
import { AuthService } from '@features/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private http = inject(HttpClient);
  private user = inject(AuthService).user;

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

    return this.http
      .patch<ApiResponse<TournamentFormDTO>>(`${environment.apiUrl}/tournaments/${id}`, body)
      .pipe(
        map((response) => {
          Toaster.success('Configuración guardada correctamente');
          return response.data;
        }),
        catchError((error) => {
          console.error(error);
          // Manage Toaster on service
          Toaster.error(error.error.message);
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

  // User's tournaments
  getUserTournaments(
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
      .get<
        PaginatedApiResponse<Tournament>
      >(`${environment.apiUrl}/tournaments/userTournaments`, { params })
      .pipe(
        map((response) => ({
          data: response.data,
          meta: response.meta,
          message: response.message,
        })),
        catchError((error) => {
          return throwError(() => error.error?.message || 'Failed to fetch user tournaments');
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

  reopenTournament(tournamentId: number): Observable<Tournament> {
    return this.http
      .post<ApiResponse<Tournament>>(`${environment.apiUrl}/tournaments/${tournamentId}/reopen`, {})
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

  isLoggedUserCreator(tournamentId: number): Observable<boolean> {
    return this.getTournament(tournamentId).pipe(
      map((response) => {
        const userId = this.user()?.id;
        return response.tournamentData.creator?.id === userId;
      }),
      catchError(() => of(false)),
    );
  }

  refreshBracket(tournamentId: number): Observable<any> {
    return this.http
      .post<
        ApiResponse<any>
      >(`${environment.apiUrl}/tournaments/${tournamentId}/bracket/change`, {})
      .pipe(map((response) => response.data));
  }
}
