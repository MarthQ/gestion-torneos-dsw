import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, PaginatedApiResponse } from '@shared/interfaces/api-response';
import { Inscription } from '@shared/interfaces/inscription';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InscriptionService {
  private http = inject(HttpClient);

  getInscriptions(tournamentId?: number): Observable<Inscription[]> {
    const params: any = {};
    if (tournamentId) params.id = tournamentId;

    return this.http
      .get<ApiResponse<Inscription[]>>(`${environment.apiUrl}/inscriptions`, { params })
      .pipe(
        tap((response) => console.log(response)),
        map((response) => response.data),
      );
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
}
