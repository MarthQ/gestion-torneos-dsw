import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse, PaginatedApiResponse } from '@shared/interfaces/api-response';
import { Inscription, InscriptionDTO } from '@shared/interfaces/inscription';
import { Tournament } from '@shared/interfaces/tournament';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InscriptionService {
  private http = inject(HttpClient);

  private inscriptionsVersion = signal(0);
  readonly inscriptionsVersionReadonly = this.inscriptionsVersion.asReadonly();

  notifyInscriptionsChanged() {
    this.inscriptionsVersion.update((v) => v + 1);
  }

  getInscriptions(tournamentId?: number): Observable<Inscription[]> {
    const params: any = {};
    if (tournamentId) params.id = tournamentId;

    return this.http
      .get<ApiResponse<Inscription[]>>(`${environment.apiUrl}/inscriptions`, { params })
      .pipe(map((response) => response.data));
  }
  getInscriptionsPaginated(
    tournamentId?: number,
    page: number = 1,
    pageSize: number = 5,
  ): Observable<PaginatedApiResponse<Inscription[]>> {
    const params: any = { page, pageSize };
    if (tournamentId) params.id = tournamentId;

    return this.http.get<PaginatedApiResponse<Inscription[]>>(
      `${environment.apiUrl}/inscriptions`,
      { params },
    );
  }

  InscribeToTournament(newInscription: InscriptionDTO): Observable<InscriptionDTO> {
    const { id, ...body } = newInscription;
    return this.http
      .post<ApiResponse<InscriptionDTO>>(`${environment.apiUrl}/inscriptions`, body)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => new Error(`No se pudo inscribir el torneo`));
        }),
      );
  }

  removeInscription(inscriptionId: number) {
    return this.http
      .delete<ApiResponse<InscriptionDTO>>(`${environment.apiUrl}/inscriptions/${inscriptionId}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          return throwError(() => new Error(`No se pudo inscribir el torneo`));
        }),
      );
  }
}
