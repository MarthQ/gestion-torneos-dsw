import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { GameService } from '@shared/services/game.service';
import { TagService } from '@shared/services/tag.service';
import { TournamentService } from '@shared/services/tournament.service';

import { QueryFilter } from '@shared/interfaces/filters';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationMeta } from '@shared/interfaces/api-response';
import { TournamentCard } from '@features/tournament-hub/components/tournament-card/tournament-card';
import { Tournament } from '@shared/interfaces/tournament';
import { SidebarService } from '@features/tournament-hub/services/sidebarService.service';
import { LimitService } from '@shared/components/limit/limit.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Limit } from '@shared/components/limit/limit';

@Component({
  imports: [SearchBar, Pagination, TournamentCard, Limit],
  templateUrl: './explore.html',
})
export class Explore {
  limitService = inject(LimitService);
  paginationService = inject(PaginationService);
  router = inject(Router);

  pageRecalculation = effect(() => {
    if (!this.tournamentResource.value()) return;
    if (!this.tournamentMeta()) return;
    const maxPage = Math.ceil(this.tournamentMeta()!.total / this.limitService.currentLimit());
    const currentPage = this.paginationService.currentPage();

    if (currentPage > maxPage && maxPage > 0) {
      this.router.navigate([], {
        queryParams: { page: maxPage },
        queryParamsHandling: 'merge',
      });
    }
  });

  tournamentService = inject(TournamentService);
  tagService = inject(TagService);
  gameService = inject(GameService);

  sidebarService = inject(SidebarService);

  // API Get parameters (for table)
  query = signal('');
  queryFilters = signal<QueryFilter>({});

  tagResource = rxResource({
    stream: () => this.tagService.getTags(),
  });
  gameResource = rxResource({
    stream: () => this.gameService.getGames(),
  });

  tournamentMeta = signal<PaginationMeta | undefined>(undefined);

  tournamentResource = rxResource({
    params: () => ({
      query: this.query(),
      queryFilters: this.queryFilters(),
      page: this.paginationService.currentPage(),
      limit: this.limitService.currentLimit(),
    }),
    stream: ({ params }) => {
      return this.tournamentService
        .getTournamentsPaginated(params.query, params.queryFilters, params.page, params.limit)
        .pipe(
          tap((response) => this.tournamentMeta.set(response.meta)),
          map((response) => response.data),
        );
    },
  });

  clickedTournament(tournament: Tournament) {
    this.sidebarService.updateRecentTournaments(tournament);
    this.router.navigate(['/tournament', tournament.id]);
  }
}
