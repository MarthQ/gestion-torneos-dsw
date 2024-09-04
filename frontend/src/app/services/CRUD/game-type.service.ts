import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GameType } from 'src/common/interfaces.js';

@Injectable({
  providedIn: 'root',
})
export class GameTypeService {
  constructor(private http: HttpClient) {}

  readonly gameTypesUrl = 'http://localhost:3000/api/game-types/';

  getGameTypes(): Observable<GameType[]> {
    console.log('Data Requested');
    return this.http.get<GameType[]>(this.gameTypesUrl);
  }

  createGameType(gameType: GameType) {
    return this.http.post<GameType>(this.gameTypesUrl, gameType);
  }

  updateGameType(gameType: GameType) {
    let updateUrl = this.gameTypesUrl + gameType.id.toString();
    console.log(updateUrl);
    return this.http.put(updateUrl, gameType);
  }

  deleteGameType(id: number) {
    let deletionUrl = this.gameTypesUrl + id.toString();
    console.log('Data about to be deleted');
    console.log(id.toString());
    console.log(deletionUrl);
    return this.http.delete(deletionUrl);
  }
}
