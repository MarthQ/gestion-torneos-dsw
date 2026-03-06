import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Tournament } from '@shared/interfaces/tournament';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private http = inject(HttpClient);

  getAllTournaments(): Observable<Tournament[]> {
    return this.http.get<ApiResponse<Tournament[]>>(`${environment.apiUrl}/tournaments`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error fetching: ', error);
        return throwError(() => new Error(`No se pudieron obtener torneos`));
      }),
    );
  }
}
