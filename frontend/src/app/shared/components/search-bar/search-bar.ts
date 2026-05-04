import { I18nSelectPipe } from '@angular/common';
import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Filters, QueryFilter } from '@shared/interfaces/filters';
import { TournamentStatus } from '@shared/interfaces/tournamentStatus';
import { TournamentUtils } from '@shared/utils/tournament-utils';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, I18nSelectPipe],
  templateUrl: './search-bar.html',
})
export class SearchBar {
  getGameImage = TournamentUtils.GetGameImage;
  query = signal('');
  debounceTime = input<number>(100);
  tournamentStatusMap = TournamentUtils.tournamentStatusMap;

  // Opcional porque en ciertos casos no hay filtros (Tags, Locations, ...)
  filters = input<Filters>();

  queryFilters = signal<QueryFilter>({});
  queryFiltered = output<QueryFilter>();

  selectedLocation = signal<number>(0);
  selectedRole = signal<number>(0);
  selectedTag = signal<number>(0);
  selectedGame = signal<number>(0);
  selectedStatus = signal<TournamentStatus | undefined>(undefined);

  queryChanged = output<string>();

  // ElementRef for resetting the query
  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  clearQuery() {
    this.query.set('');
    this.searchInput().nativeElement.value = '';
    this.selectedLocation.set(0);
    this.selectedRole.set(0);
    this.selectedTag.set(0);
    this.selectedGame.set(0);
    this.selectedStatus.set(undefined);
  }

  filterEffect = effect(() => {
    this.queryFiltered.emit({
      location: this.filters()?.locations?.find((l) => l.id === this.selectedLocation()),
      role: this.filters()?.roles?.find((r) => r.id === this.selectedRole()),
      tag: this.filters()?.tags?.find((t) => t.id === this.selectedTag()),
      game: this.filters()?.games?.find((t) => t.id === this.selectedGame()),
      status: this.selectedStatus(),
    });
  });

  queryChangeEffect = effect((onCleanup) => {
    const queryValue = this.query();

    const timeout = setTimeout(() => {
      this.queryChanged.emit(queryValue);
    }, this.debounceTime());

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
