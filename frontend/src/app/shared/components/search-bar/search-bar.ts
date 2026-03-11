import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Filters, QueryFilter } from '@shared/interfaces/filters';
import { Location } from '@shared/interfaces/location';
import { Role } from '@shared/interfaces/role';
import { Tag } from '@shared/interfaces/tag';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
})
export class SearchBar {
  query = signal('');
  debounceTime = input<number>(100);

  // Opcional porque en ciertos casos no hay filtros (Tags, Locations, ...)
  filters = input<Filters>();

  queryFilters = signal<QueryFilter>({});
  queryFiltered = output<QueryFilter>();

  selectedLocation = signal<number>(0);
  selectedRole = signal<number>(0);
  selectedTag = signal<number>(0);

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
