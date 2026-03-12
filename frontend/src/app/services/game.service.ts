import { Injectable } from '@angular/core';
import { Game } from '@shared/interfaces/game';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  getGames(): Observable<Game[]> {
    return of([]);
  }
}
