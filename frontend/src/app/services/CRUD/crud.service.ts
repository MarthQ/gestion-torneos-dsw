import { Injectable, OnInit } from '@angular/core';

import { GameType } from 'src/common/interfaces.js';

@Injectable({
  providedIn: 'root',
})
export class CRUDService {
  constructor() {}

  gameTypes: GameType[] = [
    {
      id: 1,
      name: 'Classic Fighter',
      description: 'The most famous Classic Fighter is Street Fighter.',
    },
  ];

  getGameTypes(): GameType[] {
    return this.gameTypes;
  }
}
