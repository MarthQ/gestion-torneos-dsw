import {
  Component,
  computed,
  ElementRef,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { GameService } from '@shared/services/game.service';
import { Toaster } from '@shared/utils/toaster';
import { Game } from '@shared/interfaces/game';
import { map, of, tap } from 'rxjs';

import { Pagination } from '@shared/components/pagination/pagination';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { GameCrudModal } from './game-crud-modal/game-crud-modal';
import { JsonPipe } from '@angular/common';
import { DataTable } from '@shared/components/data-table/data-table';
import { TableColumn } from '@shared/interfaces/table-column';
import { TableAction } from '@shared/interfaces/table-action';
import { TableState } from '@shared/interfaces/table-state';
import { PaginationMeta } from '@shared/interfaces/api-response';

@Component({
  imports: [Pagination, SearchBar, GameCrudModal, DataTable],
  templateUrl: './game-crud.html',
})
export class GameCrud {
  gameService = inject(GameService);

  // ElementRef for resetting the query
  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  // API Get parameters (for table)
  query = signal('');
  page = linkedSignal({
    source: this.query,
    computation: () => 1,
  });
  pageSize = 10;

  // Modal parameters
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  selectedGame = signal<Partial<Game>>({});

  gameMeta = signal<PaginationMeta | undefined>(undefined);

  igdbGameResource = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) => {
      if (params.query) return this.gameService.getIGDBGames(params.query);
      return of([]);
    },
  });

  gameResource = rxResource({
    params: () => ({ query: this.query(), page: this.page() }),
    stream: ({ params }) => {
      return this.gameService.getGamesPaginated(params.query).pipe(
        tap((response) => console.log(response)),
        tap((response) => this.gameMeta.set(response.meta)),
        map((response) => response.data),
      );
    },
  });

  // igdbGames but the games that are in our db get replaced in the igdbGames array
  gameData = computed(() => {
    const dbGames = this.gameResource.value() ?? [];
    const igdbGames = this.igdbGameResource.value() ?? [];

    const integratedGames = igdbGames.map((igdbGame) => {
      const dbGame = dbGames.find((game) => game.igdbId == igdbGame.igdbId);
      return dbGame ?? igdbGame;
    });
    return integratedGames.length ? integratedGames : dbGames;
  });

  // Visual actions (pagination)
  pageChangedTo(newPage: number) {
    this.page.set(newPage);
  }

  // Looks for the game in the gameResource
  isInDatabase(game: Game): boolean {
    return !!this.gameResource.value()?.find((myGame) => myGame.igdbId === game.igdbId);
  }

  // Table configuration
  gameColumns: TableColumn<Game>[] = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'igdbId', label: 'IGDB ID', width: '100px' },
    { key: 'imgUrl', label: 'Foto', width: '80px', align: 'center', type: 'image', alt: (game) => `Foto de ${game.name}` },
    { key: 'name', label: 'Nombre del juego' },
    { key: 'description', label: 'Descripción', truncate: true },
  ];

  gameActions: TableAction<Game>[] = [
    {
      icon: 'boxicons--edit-filled',
      label: 'Editar juego',
      action: 'edit',
      condition: (game) => this.isInDatabase(game),
      color: 'warning',
    },
    {
      icon: 'boxicons--trash',
      label: 'Eliminar juego',
      action: 'delete',
      condition: (game) => this.isInDatabase(game),
      color: 'error',
    },
    {
      icon: 'ic--baseline-plus',
      label: 'Agregar juego',
      action: 'edit', // Using edit as proxy
      condition: (game) => !this.isInDatabase(game),
      color: 'success',
    },
  ];

  tableState = computed<TableState>(() => {
    if (this.gameResource.isLoading()) return 'loading';
    if (this.gameResource.hasValue() && this.gameResource.value().length === 0) return 'empty';
    return 'hasData';
  });

  handleRowAction(event: { action: 'edit' | 'delete'; row: Game }) {
    if (this.isInDatabase(event.row)) {
      if (event.action === 'edit') {
        this.editGame(event.row);
      } else {
        this.deleteGame(event.row);
      }
    }
  }

  editGame(game: Game) {
    this.modalType.set('edit');
    this.selectedGame.set(game);
    this.openModal.set(true);
  }
  deleteGame(game: Game) {
    this.modalType.set('delete');
    this.selectedGame.set(game);
    this.openModal.set(true);
  }

  handleCrudAction(game: Game) {
    switch (this.modalType()) {
      case 'add':
        this.gameService.addGame(game).subscribe({
          next: () => {
            Toaster.success('El juego se agregó correctamente');
            this.gameResource.reload();
            this.igdbGameResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
        break;
      case 'edit':
        this.gameService.updateGame(game).subscribe({
          next: () => {
            Toaster.success('El juego se modificó correctamente');
            this.gameResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
        break;
      case 'delete':
        this.gameService.deleteGame(game).subscribe({
          next: () => {
            Toaster.success('El juego se eliminó correctamente');
            this.gameResource.reload();
            this.igdbGameResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
    }
  }
}
