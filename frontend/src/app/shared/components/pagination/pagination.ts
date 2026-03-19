import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { PaginationMeta } from '@shared/interfaces/api-response';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
})
export class Pagination {
  entityMeta = input<PaginationMeta>();
  inputPage = input.required<number>();
  page = linkedSignal({
    source: this.inputPage,
    computation: () => this.inputPage(),
  });
  currentPage = output<number>();

  // total pages is a computed signal that generates an array like [1, 2, 3, ... at last is the value returned by the backend as totalPages]
  totalPages = computed(() =>
    Array.from({ length: this.entityMeta()?.totalPages ?? 0 }, (_, i) => i + 1),
  );

  // noPages is used when the table has an empty array.
  noPages() {
    return this.totalPages().length === 0;
  }

  moveToPreviousPage() {
    this.page.update((current) => current - 1);
    this.currentPage.emit(this.page());
  }
  moveToPage(p: number) {
    this.page.set(p);
    this.currentPage.emit(this.page());
  }
  moveToNextPage() {
    this.page.update((current) => current + 1);
    this.currentPage.emit(this.page());
  }
}
