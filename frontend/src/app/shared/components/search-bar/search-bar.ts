import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
})
export class SearchBar {
  query = signal('');
  debounceTime = input<number>(100);

  queryChanged = output<string>();

  // ElementRef for resetting the query
  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  clearQuery() {
    this.query.set('');
    this.searchInput().nativeElement.value = '';
  }

  queryChange = effect((onCleanup) => {
    const queryValue = this.query();

    const timeout = setTimeout(() => {
      this.queryChanged.emit(queryValue);
    }, this.debounceTime());

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
