import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Game } from 'src/common/interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) {}
  readonly gameUrl = 'http://localhost:3000/api/games/';

  getGames(): Observable<Game[]> {
    return this.http
      .get<{ data: Game[] }>(this.gameUrl)
      .pipe(map((response) => response.data));
  }

  createGame(game: Game): Observable<Game> {
    return this.http.post<Game>(this.gameUrl, game);
  }

  updateGame(game: Game) {
    let updateUrl = this.gameUrl + game.id.toString();
    return this.http.put(updateUrl, game);
  }

  deleteGame(id: number) {
    let deletionUrl = this.gameUrl + id.toString();
    return this.http.delete(deletionUrl);
  }
}
