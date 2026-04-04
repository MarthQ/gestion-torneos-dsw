import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { Tournament, TournamentFormDTO } from '@shared/interfaces/tournament';
import { TournamentService } from '@shared/services/tournament.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Toaster } from '@shared/utils/toaster';
import { LocationService } from '@shared/services/location.service';
import { TagService } from '@shared/services/tag.service';
import { UserService } from '@shared/services/user.service';
import { QueryFilter } from '@shared/interfaces/filters';
import { PaginationMeta } from '@shared/interfaces/api-response';
import { map, tap } from 'rxjs';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { Pagination } from '@shared/components/pagination/pagination';
import { TournamentCrudModal } from './tournament-crud-modal/tournament-crud-modal';
import { GameService } from '@shared/services/game.service';
import { tournamentStatusMap } from '@shared/utils/tournament-map-styles';
import { CrudAction } from '@shared/interfaces/crudAction';
import { DataTable } from '@shared/components/data-table/data-table';
import { TableColumn } from '@shared/interfaces/table-column';
import { TableAction } from '@shared/interfaces/table-action';
import { TableState } from '@shared/interfaces/table-state';

@Component({
  imports: [SearchBar, Pagination, TournamentCrudModal, DataTable],
  templateUrl: './tournament-crud.html',
})
export class TournamentCrud {
  tournamentService = inject(TournamentService);
  tournamentStatusMap = tournamentStatusMap;

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

  handleCrudAction(event: CrudAction<TournamentFormDTO>) {
    switch (event.actionType) {
      case 'create':
        this.tournamentService.addTournament(event.data).subscribe({
          next: () => {
            Toaster.success('El torneo se agregó correctamente');
            this.tournamentResource.reload();
          },
          error: (message: string) => {
            Toaster.error(message);
          },
        });
        break;
      case 'update':
        this.tournamentService.updateTournament(event.data).subscribe({
          next: () => {
            Toaster.success('El torneo se modificó correctamente');
            this.tournamentResource.reload();
          },
          error: (message: string) => {
            Toaster.error(message);
          },
        });
        break;
      case 'delete':
        this.tournamentService.deleteTournament(event.data).subscribe({
          next: () => {
            Toaster.success('El torneo se eliminó correctamente');
            this.tournamentResource.reload();
          },
          error: (message: string) => {
            Toaster.error(message);
          },
        });
    }
  }

  // Data Table Configuration
  tournamentColumns: TableColumn<Tournament>[] = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'name', label: 'Nombre', width: '180px' },
    { key: 'description', label: 'Descripción', truncate: true },
    { key: 'datetimeinit', label: 'Fecha y Hora', width: '150px' },
    { 
      key: 'status', 
      label: 'Estado',
      width: '120px',
    },
    { key: 'maxParticipants', label: 'Cupo Máximo', width: '100px', align: 'center' },
    { key: 'location.name', label: 'Localidad', width: '120px' },
    { key: 'creator.name', label: 'Creador', width: '140px' },
    { key: 'game.name', label: 'Juego', width: '120px' },
  ];

  tournamentActions: TableAction<Tournament>[] = [
    {
      icon: 'boxicons--edit-filled',
      label: 'Editar torneo',
      action: 'edit',
      color: 'warning',
    },
    {
      icon: 'boxicons--trash',
      label: 'Eliminar torneo',
      action: 'delete',
      color: 'error',
    },
  ];

  tableState = computed<TableState>(() => {
    if (this.tournamentResource.isLoading()) return 'loading';
    if (this.tournamentResource.hasValue() && this.tournamentResource.value().length === 0) return 'empty';
    return 'hasData';
  });

  handleRowAction(event: { action: 'edit' | 'delete'; row: Tournament }) {
    if (event.action === 'edit') {
      this.editTournament(event.row);
    } else {
      this.deleteTournament(event.row);
    }
  }
}
