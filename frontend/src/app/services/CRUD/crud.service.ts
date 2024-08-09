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
}
