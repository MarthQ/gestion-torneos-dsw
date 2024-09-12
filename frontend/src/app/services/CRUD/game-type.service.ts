import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { GameType } from 'src/common/interfaces.js';

@Injectable({
  providedIn: 'root',
})
export class GameTypeService {
  constructor(private http: HttpClient) {}

  readonly gameTypesUrl = 'http://localhost:3000/api/game-types/';

  getGameTypes(): Observable<GameType[]> {
    return this.http
      .get<{ data: GameType[] }>(this.gameTypesUrl)
      .pipe(map((response) => response.data));
  }

  createGameType(gameType: GameType) {
    const { id, ...gameTypeData } = gameType;
    return this.http.post<GameType>(this.gameTypesUrl, gameTypeData);
  }

  updateGameType(gameType: GameType) {
    let updateUrl = this.gameTypesUrl + gameType.id.toString();
    return this.http.put(updateUrl, gameType);
  }

  deleteGameType(id: number) {
    let deletionUrl = this.gameTypesUrl + id.toString();
    return this.http.delete(deletionUrl);
  }
}
