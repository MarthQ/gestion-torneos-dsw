import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { PaginatedApiResponse } from '@shared/interfaces/api-response';
import { Inscription } from '@shared/interfaces/inscription';

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
}
