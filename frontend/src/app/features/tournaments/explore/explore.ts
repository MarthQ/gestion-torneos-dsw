import { DatePipe, I18nSelectPipe } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import { GameService } from '@services/game.service';
import { TagService } from '@services/tag.service';
import { TournamentService } from '@services/tournament.service';

import {
  GetGameImage,
  TournamentActionMap,
  TournamentStatusMap,
} from '@shared/utils/tournament-styles';
import { QueryFilter } from '@shared/interfaces/filters';
import { Tournament } from '@shared/interfaces/tournament';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { Pagination } from '@shared/components/pagination/pagination';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  imports: [I18nSelectPipe, DatePipe, SearchBar, Pagination],
  templateUrl: './explore.html',
})
export class Explore {
  tournamentActionMap = TournamentActionMap;
  tournamentStatusMap = TournamentStatusMap;
  getGameImage = GetGameImage;
  tournamentService = inject(TournamentService);
  tagService = inject(TagService);
  gameService = inject(GameService);

  router = inject(Router);

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

  viewTournament(tournament: Tournament) {
    this.router.navigate(['/tournaments/tournament'], { queryParams: { id: tournament.id } });
  }
}
