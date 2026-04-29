import { Component, inject, linkedSignal, signal } from '@angular/core';
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

@Component({
  imports: [SearchBar, Pagination, RouterLink, TournamentCard],
  templateUrl: './myTournaments.html',
})
export class MyTournaments {
  private tournamentService = inject(TournamentService);
  private sidebarService = inject(SidebarService);
  private router = inject(Router);

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

  clickedTournament(tournament: Tournament) {
    this.sidebarService.updateRecentTournaments(tournament);
    this.router.navigate(['/tournament', tournament.id]);
  }

  // Visual actions (pagination)
  pageChangedTo(newPage: number) {
    this.page.set(newPage);
  }
}
