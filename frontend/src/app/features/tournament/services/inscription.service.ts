import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse, PaginatedApiResponse } from '@shared/interfaces/api-response';
import { Inscription } from '@shared/interfaces/inscription';
import { Toaster } from '@shared/utils/toaster';

@Injectable({
  providedIn: 'root',
})
export class InscriptionService {
  private http = inject(HttpClient);

  getInscriptionsPaginated(
    tournamentId?: number,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PaginatedApiResponse<Inscription>> {
    const params: any = { page, pageSize };
    if (tournamentId) params.tournament = tournamentId;

    return this.http
      .get<PaginatedApiResponse<Inscription>>(`${environment.apiUrl}/inscriptions`, {
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

  inscribeToTournament(tournamentId: number, nickname: string): Observable<Inscription> {
    return this.http
      .post<ApiResponse<Inscription>>(
        `${environment.apiUrl}/tournaments/${tournamentId}/inscriptions`,
        {
          nickname,
        },
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          return throwError(() => error.error.message);
        }),
      );
  }
  deleteInscription(tournamentId: number) {
    return this.http
      .delete<
        ApiResponse<Inscription>
      >(`${environment.apiUrl}/tournaments/${tournamentId}/inscriptions`)
      .pipe(
        catchError((error) => {
          return throwError(() => error.error.message);
        }),
      );
  }
}
