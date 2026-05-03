import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { TournamentService } from '../../../../shared/services/tournament.service';
import { GameService } from '@shared/services/game.service';
import { TagService } from '@shared/services/tag.service';

import { SearchBar } from '@shared/components/search-bar/search-bar';
import { QueryFilter } from '@shared/interfaces/filters';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationMeta } from '@shared/interfaces/api-response';
import { TournamentCard } from '@features/tournament-hub/components/tournament-card/tournament-card';
import { Tournament } from '@shared/interfaces/tournament';
import { SidebarService } from '@features/tournament-hub/services/sidebarService.service';
import { LimitService } from '@shared/components/limit/limit.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Limit } from '@shared/components/limit/limit';
import { map, tap } from 'rxjs';

@Component({
  imports: [SearchBar, Pagination, RouterLink, TournamentCard, Limit],
  templateUrl: './myTournaments.html',
})
export class MyTournaments {
  limitService = inject(LimitService);
  paginationService = inject(PaginationService);
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

  private tournamentService = inject(TournamentService);
  private sidebarService = inject(SidebarService);
  private router = inject(Router);

  tagService = inject(TagService);
  gameService = inject(GameService);

  // API Get parameters (for table)
  query = signal('');
  queryFilters = signal<QueryFilter>({});

  tournamentMeta = signal<PaginationMeta | undefined>(undefined);

  tagResource = rxResource({
    stream: () => this.tagService.getTags(),
  });
  gameResource = rxResource({
    stream: () => this.gameService.getGames(),
  });

  tournamentResource = rxResource({
    params: () => ({
      query: this.query(),
      queryFilters: this.queryFilters(),
      page: this.paginationService.currentPage(),
      limit: this.limitService.currentLimit(),
    }),
    stream: ({ params }) => {
      return this.tournamentService
        .getUserTournaments(params.query, params.queryFilters, params.page, params.limit)
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
