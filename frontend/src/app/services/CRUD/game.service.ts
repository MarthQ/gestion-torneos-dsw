import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Game } from 'src/common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient) {}
  readonly gameUrl = 'http://localhost:3000/api/games/';

  getGames(): Observable<Game[]> {
    console.log('Data Requested');
    return this.http.get<Game[]>(this.gameUrl);
  }

  createGame(game: Game): Observable<Game> {
    return this.http.post<Game>(this.gameUrl, game);
  }

  updateGame(game: Game) {
    let updateUrl = this.gameUrl + game.id.toString();
    console.log(updateUrl);
    return this.http.put(updateUrl, game);
  }

  deleteGame(id: number) {
    let deletionUrl = this.gameUrl + id.toString();
    console.log('Data about to be deleted');
    console.log(id.toString());
    console.log(deletionUrl);
    return this.http.delete(deletionUrl);
  }
}
