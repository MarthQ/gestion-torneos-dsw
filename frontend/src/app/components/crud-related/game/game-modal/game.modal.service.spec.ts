import { TestBed } from '@angular/core/testing';

import { GameModalService } from 'src/app/components/crud-related/game/game-modal/game.modal.service.js';

describe('GameModalService', () => {
  let service: GameModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
