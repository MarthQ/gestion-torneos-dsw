import { TestBed } from '@angular/core/testing';
import { Explore } from './explore';
import { TournamentService } from '@services/tournament.service';
import { TagService } from '@services/tag.service';
import { GameService } from '@services/game.service';

describe('Explore', () => {
  let component: Explore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: TournamentService, useValue: { getTournamentsPaginated: vi.fn() } },
        { provide: TagService, useValue: { getTags: vi.fn() } },
        { provide: GameService, useValue: { getGames: vi.fn() } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(Explore);
    component = fixture.componentInstance;
  });

  it('should return placeholder URL when tournament has no image', () => {
    const tournament = { name: 'Torneo Test', game: { imgUrl: '' } } as any;
    const style = component.getBackgroundImageStyle(tournament);
    expect(style).toContain('placehold.co');
  });

  it('should return game image URL when tournament has an image', () => {
    const tournament = { name: 'Torneo Test', game: { imgUrl: 'https://example.com/img.jpg' } } as any;
    const style = component.getBackgroundImageStyle(tournament);
    expect(style).toContain('https://example.com/img.jpg');
  });
});
