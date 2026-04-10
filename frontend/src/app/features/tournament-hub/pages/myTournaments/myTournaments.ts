import { Component, inject, linkedSignal, signal } from '@angular/core';
import { TournamentService } from '../../../../shared/services/tournament.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Tournament } from '@shared/interfaces/tournament';
import { DatePipe, I18nSelectPipe } from '@angular/common';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { TagService } from '@shared/services/tag.service';
import { GameService } from '@shared/services/game.service';
import { QueryFilter } from '@shared/interfaces/filters';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationMeta } from '@shared/interfaces/api-response';
import { RouterLink } from '@angular/router';
import { TournamentUtils } from '@shared/utils/tournament-utils';
import { IGDB_SIZE, GameImagePipe } from '@shared/pipes/game-image.pipe';

@Component({
  imports: [DatePipe, SearchBar, Pagination, RouterLink, GameImagePipe],
  templateUrl: './myTournaments.html',
})
export class MyTournaments {
  private tournamentService = inject(TournamentService);
  tagService = inject(TagService);
  gameService = inject(GameService);
  getBackgroundStyle = TournamentUtils.GetGameImage;
  IGDB_SIZE = IGDB_SIZE;

  // API Get parameters (for table)
  query = signal('');
  queryFilters = signal<QueryFilter>({});
  page = linkedSignal({
    source: this.query,
    computation: () => 1,
  });
  pageSize = 10;

  tournamentMeta = signal<PaginationMeta | undefined>(undefined);

  tagResource = rxResource({
    stream: () => this.tagService.getTags(),
  });
  gameResource = rxResource({
    stream: () => this.gameService.getGames(),
  });

  tournamentResource = rxResource({
    params: () => ({ query: this.query(), queryFilters: this.queryFilters(), page: this.page() }),
    stream: ({ params }) => {
      return this.tournamentService.getUserTournaments(
        params.query,
        params.queryFilters,
        params.page,
        this.pageSize,
      );
    },
  });

  // Visual actions (pagination)
  pageChangedTo(newPage: number) {
    this.page.set(newPage);
  }
}
