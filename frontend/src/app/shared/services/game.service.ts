import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Game } from '@shared/interfaces/game';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private http = inject(HttpClient);

  getIGDBGames(query: string): Observable<Game[]> {
    return this.http
      .get<ApiResponse<Game[]>>(`${environment.apiUrl}/games/search`, {
        params: { query },
      })
      .pipe(map((response) => response.data));
  }

  // Without pagination
  getGames(): Observable<Game[]> {
    return this.http
      .get<ApiResponse<Game[]>>(`${environment.apiUrl}/games`)
      .pipe(map((response) => response.data));
  }

  getGamesPaginated(
    query?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PaginatedApiResponse<Game>> {
    const params: any = { page, pageSize };
    if (query) params.query = query;

    return this.http
      .get<PaginatedApiResponse<Game>>(`${environment.apiUrl}/games`, {
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

  addGame(newGame: Game): Observable<Game> {
    const { igdbId, ...rest } = newGame;

    return this.http.post<ApiResponse<Game>>(`${environment.apiUrl}/games`, { igdbId }).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error adding game: ', error);
        return throwError(() => new Error(`No se pudo agregar el juego`));
      }),
    );
  }

  updateGame(updatedGame: Game): Observable<Game> {
    const { id, ...body } = updatedGame;

    return this.http.patch<ApiResponse<Game>>(`${environment.apiUrl}/games/${id}`, body).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error updating game: ', error);
        return throwError(() => new Error(`No se pudo modificar el juego`));
      }),
    );
  }

  deleteGame(toBeDeletedGame: Game): Observable<Game> {
    const { id, ...rest } = toBeDeletedGame;

    return this.http.delete<ApiResponse<Game>>(`${environment.apiUrl}/games/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.log('Error removing game: ', error);
        return throwError(() => new Error(`No se pudo borrar el juego`));
      }),
    );
  }
}
