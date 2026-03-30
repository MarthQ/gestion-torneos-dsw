import { DatePipe, I18nSelectPipe } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import { GameService } from '@shared/services/game.service';
import { TagService } from '@shared/services/tag.service';
import { TournamentService } from '@shared/services/tournament.service';

import { TournamentActionMap, tournamentStatusMap } from '@shared/utils/tournament-map-styles';
import { QueryFilter } from '@shared/interfaces/filters';
import { Tournament } from '@shared/interfaces/tournament';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { Pagination } from '@shared/components/pagination/pagination';

@Component({
  imports: [I18nSelectPipe, DatePipe, SearchBar, Pagination],
  templateUrl: './explore.html',
})
export class Explore {
  tournamentActionMap = TournamentActionMap;
  tournamentStatusMap = tournamentStatusMap;
  tournamentService = inject(TournamentService);
  tagService = inject(TagService);
  gameService = inject(GameService);

  // API Get parameters (for table)
  query = signal('');
  queryFilters = signal<QueryFilter>({});
  page = linkedSignal({
    source: this.query,
    computation: () => 1,
  });
  pageSize = 10;

  tagResource = rxResource({
    stream: () => this.tagService.getTags(),
  });
  gameResource = rxResource({
    stream: () => this.gameService.getGames(),
  });

  tournamentMeta = signal<PaginationMeta | undefined>(undefined);

  tournamentResource = rxResource({
    params: () => ({ query: this.query(), queryFilters: this.queryFilters(), page: this.page() }),
    stream: ({ params }) => {
      return this.tournamentService
        .getTournamentsPaginated(params.query, params.queryFilters, params.page, this.pageSize)
        .pipe(
          tap((response) => this.tournamentMeta.set(response.meta)),
          map((response) => response.data),
        );
    },
  });

  // Visual actions (pagination)
  pageChangedTo(newPage: number) {
    this.page.set(newPage);
  }

  // tournaments: Tournament[] = [
  //   {
  //     id: 1,
  //     imgUrl: '',
  //     status: 'Abierto',
  //     participants: 5,
  //     maxParticipants: 16,
  //     name: 'Mortal Kombat',
  //     location: 'San Nicolás',
  //     datetime: '29 de octubre 15:00hs',
  //   },
  //   {
  //     id: 2,
  //     imgUrl: 'https://example.com/fifa.jpg',
  //     status: 'Cerrado',
  //     participants: 16,
  //     maxParticipants: 16,
  //     name: 'FIFA 24',
  //     location: 'Rosario',
  //     datetime: '5 de noviembre 18:30hs',
  //   },
  //   {
  //     id: 3,
  //     imgUrl: 'https://example.com/cod.jpg',
  //     status: 'En curso',
  //     participants: 12,
  //     maxParticipants: 12,
  //     name: 'Call of Duty Warzone',
  //     location: 'Buenos Aires',
  //     datetime: '12 de noviembre 20:00hs',
  //   },
  //   {
  //     id: 4,
  //     imgUrl: 'https://example.com/lol.jpg',
  //     status: 'Abierto',
  //     participants: 8,
  //     maxParticipants: 10,
  //     name: 'League of Legends',
  //     location: 'Córdoba',
  //     datetime: '18 de noviembre 14:00hs',
  //   },
  //   {
  //     id: 5,
  //     imgUrl: '',
  //     status: 'Abierto',
  //     participants: 3,
  //     maxParticipants: 8,
  //     name: 'Valorant',
  //     location: 'La Plata',
  //     datetime: '25 de noviembre 19:00hs',
  //   },
  //   {
  //     id: 6,
  //     imgUrl: 'https://example.com/smash.jpg',
  //     status: 'Finalizado',
  //     participants: 16,
  //     maxParticipants: 16,
  //     name: 'Super Smash Bros Ultimate',
  //     location: 'Mendoza',
  //     datetime: '2 de octubre 16:00hs',
  //   },
  // ];

  getBackgroundImageStyle(tournament: Tournament) {
    if (tournament.game.imgUrl) {
      return `background-image: url('${tournament.game.imgUrl}');`;
    } else {
      return `background-image: url(https://placehold.co/600x400/1e293b/white?text=${tournament.name.replace(' ', '+')});`;
    }
  }
}
