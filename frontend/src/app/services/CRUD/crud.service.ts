import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { GameType } from 'src/common/interfaces.js';

@Injectable({
  providedIn: 'root',
})
export class CRUDService {
  constructor(private http: HttpClient) {}

  readonly gameTypesUrl = 'http://localhost:3000/api/game-types/';

  getGameTypes() {
    console.log('Data Requested');
    return this.http.get(this.gameTypesUrl);
  }

  createGameType(gameType: GameType) {
    return this.http.post(this.gameTypesUrl, gameType);
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
