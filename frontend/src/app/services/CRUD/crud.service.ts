import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { GameType } from 'src/common/interfaces.js';

@Injectable({
  providedIn: 'root',
})
export class CRUDService {
  constructor(private http: HttpClient) {}

  readonly baseUrl = 'http://localhost:3000/api';
  gameTypes: GameType[] = [];

  getGameTypes() {
    let gameTypesUrl = this.baseUrl + '/game-types';
    console.log('Data Requested');
    return this.http.get(gameTypesUrl);
  }

  deleteGameType(id: number) {
    let deletionUrl = this.baseUrl + '/game-types/' + id.toString();
    console.log('Data about to be deleted');
    console.log(id.toString());
    console.log(deletionUrl);
    return this.http.delete(deletionUrl);
  }
}
