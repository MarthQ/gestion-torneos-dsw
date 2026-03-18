import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Filters, QueryFilter } from '@shared/interfaces/filters';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
})
export class SearchBar {
  activatedRoute = inject(ActivatedRoute);

  // Query parameter that comes in the url.
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal(() => this.queryParam);
  router = inject(Router);

  debounceTime = input<number>(300);

  // Opcional porque en ciertos casos no hay filtros (Tags, Locations, ...)
  filters = input<Filters>();

  queryFilters = signal<QueryFilter>({});
  queryFiltered = output<QueryFilter>();

  selectedLocation = signal<number>(0);
  selectedRole = signal<number>(0);
  selectedTag = signal<number>(0);
  selectedGame = signal<number>(0);

  queryChanged = output<string>();

  // ElementRef for resetting the query
  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  clearQuery() {
    this.query.set('');
    this.searchInput().nativeElement.value = '';
  }

  filterEffect = effect(() => {
    this.queryFiltered.emit({
      location: this.filters()?.locations?.find((l) => l.id === this.selectedLocation()),
      role: this.filters()?.roles?.find((r) => r.id === this.selectedRole()),
      tag: this.filters()?.tags?.find((t) => t.id === this.selectedTag()),
      game: this.filters()?.games?.find((t) => t.id === this.selectedGame()),
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

  onQueryChanged() {
    const query = this.searchInput().nativeElement.value;
    this.query.set(query);
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: { query },
      queryParamsHandling: 'merge',
    });
  }
}
