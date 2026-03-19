import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { Tournament, TournamentFormDTO } from '@shared/interfaces/tournament';
import { TournamentService } from '@services/tournament.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe, I18nSelectPipe } from '@angular/common';
import { Toaster } from '@shared/utils/toaster';
import { LocationService } from '@services/location.service';
import { TagService } from '@services/tag.service';
import { UserService } from '@services/user.service';
import { QueryFilter } from '@shared/interfaces/filters';
import { map, tap } from 'rxjs';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { Pagination } from '@shared/components/pagination/pagination';
import { TournamentCrudModal } from './tournament-crud-modal/tournament-crud-modal';
import { GameService } from '@services/game.service';
import { TournamentStatusMap } from '@shared/utils/tournament-styles';
import { PaginationMeta } from '@shared/interfaces/api-response';

@Component({
  selector: 'app-tournament-crud',
  imports: [SearchBar, Pagination, TournamentCrudModal, DatePipe, I18nSelectPipe],
  templateUrl: './tournament-crud.html',
})
export class TournamentCrud {
  tournamentService = inject(TournamentService);
  tournamentStatusMap = TournamentStatusMap;

  userService = inject(UserService);
  locationService = inject(LocationService);
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

  // Modal parameters
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  selectedTournament = signal<Partial<Tournament>>({});

  tournamentMeta = signal<PaginationMeta | undefined>(undefined);

  // Resource initialization for queryFilters
  locationResource = rxResource({
    stream: () => this.locationService.getLocations(),
  });
  userResource = rxResource({
    stream: () => this.userService.getUsers(),
  });
  tagResource = rxResource({
    stream: () => this.tagService.getTags(),
  });
  gameResource = rxResource({
    stream: () => this.gameService.getGames(),
  });

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

  // CRUD Actions
  addTournament() {
    this.modalType.set('add');
    this.selectedTournament.set({});
    this.openModal.set(true);
  }
  editTournament(tournament: Tournament) {
    this.modalType.set('edit');
    this.selectedTournament.set(tournament);
    this.openModal.set(true);
  }
  deleteTournament(tournament: Tournament) {
    this.modalType.set('delete');
    this.selectedTournament.set(tournament);
    this.openModal.set(true);
  }

  handleCrudAction(tournament: TournamentFormDTO) {
    switch (this.modalType()) {
      case 'add':
        this.tournamentService.addTournament(tournament).subscribe({
          next: () => {
            Toaster.success('El torneo se agregó correctamente');
            this.tournamentResource.reload();
          },
          error: (err) => {
            Toaster.error(err);
          },
        });
        break;
      case 'edit':
        this.tournamentService.updateTournament(tournament).subscribe({
          next: () => {
            Toaster.success('El torneo se modificó correctamente');
            this.tournamentResource.reload();
          },
          error: (err) => {
            Toaster.error(err);
          },
        });
        break;
      case 'delete':
        this.tournamentService.deleteTournament(tournament).subscribe({
          next: () => {
            Toaster.success('El torneo se eliminó correctamente');
            this.tournamentResource.reload();
          },
          error: (err) => {
            Toaster.error(err);
          },
        });
    }
  }
}
