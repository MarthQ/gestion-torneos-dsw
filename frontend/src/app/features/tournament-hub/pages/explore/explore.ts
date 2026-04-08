import { DatePipe, I18nSelectPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import { GameService } from '@shared/services/game.service';
import { TagService } from '@shared/services/tag.service';
import { TournamentService } from '@shared/services/tournament.service';

import { QueryFilter } from '@shared/interfaces/filters';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationMeta } from '@shared/interfaces/api-response';
import { TournamentUtils } from '@shared/utils/tournament-utils';
import { RouterLink } from '@angular/router';

@Component({
  imports: [I18nSelectPipe, DatePipe, SearchBar, Pagination, RouterLink, TitleCasePipe],
  templateUrl: './explore.html',
})
export class Explore {
  tournamentActionMap = TournamentUtils.tournamentActionMap;
  tournamentStatusMap = TournamentUtils.tournamentStatusMap;
  tournamentStatusBadgeMap = TournamentUtils.tournamentStatusBadgeMap;
  getBackgroundStyle = TournamentUtils.GetGameImage;

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
}
