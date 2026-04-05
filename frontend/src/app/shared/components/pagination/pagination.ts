import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { PaginationMeta } from '@shared/interfaces/api-response';

interface PageItem {
  n: number;
  ellipsis: boolean;
}

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

  // Computed array of page items with ellipsis markers
  visiblePages = computed<PageItem[]>(() => {
    const total = this.entityMeta()?.totalPages ?? 0;
    const current = this.page();

    if (total === 0) return [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => ({ n: i + 1, ellipsis: false }));
    }

    const pages: PageItem[] = [];

    // Always include first page
    pages.push({ n: 1, ellipsis: false });

    if (current <= 4) {
      // Near the start: show 2, 3, 4, 5
      for (let i = 2; i <= 5; i++) {
        pages.push({ n: i, ellipsis: false });
      }
      pages.push({ n: -1, ellipsis: true }); // ellipsis
      pages.push({ n: total, ellipsis: false }); // last
    } else if (current >= total - 3) {
      // Near the end: show total-4, total-3, total-2, total-1
      pages.push({ n: -1, ellipsis: true }); // ellipsis
      for (let i = total - 4; i <= total - 1; i++) {
        pages.push({ n: i, ellipsis: false });
      }
      pages.push({ n: total, ellipsis: false }); // last (already added, but safe)
    } else {
      // Middle: show current-1, current, current+1
      pages.push({ n: -1, ellipsis: true }); // ellipsis
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push({ n: i, ellipsis: false });
      }
      pages.push({ n: -1, ellipsis: true }); // ellipsis
      pages.push({ n: total, ellipsis: false });
    }

    return pages;
  });

  // Info text: "Página X de Y · Z resultados" o "X resultados · Única página"
  infoText = computed(() => {
    const meta = this.entityMeta();
    if (!meta) return '';
    
    if (meta.total === 0) {
      return 'Sin resultados';
    }
    
    if (meta.totalPages === 1) {
      return `${meta.total} resultado${meta.total !== 1 ? 's' : ''} · Única página`;
    }
    
    return `Página ${meta.page} de ${meta.totalPages} · ${meta.total} resultados`;
  });

  noPages() {
    return this.totalPages().length === 0;
  }

  totalPages = computed(() =>
    Array.from({ length: this.entityMeta()?.totalPages ?? 0 }, (_, i) => i + 1),
  );

  moveToPreviousPage() {
    if (this.page() > 1) {
      this.page.update((current) => current - 1);
      this.currentPage.emit(this.page());
    }
  }

  moveToPage(p: number) {
    this.page.set(p);
    this.currentPage.emit(this.page());
  }

  moveToNextPage() {
    const maxPage = this.entityMeta()?.totalPages ?? 1;
    if (this.page() < maxPage) {
      this.page.update((current) => current + 1);
      this.currentPage.emit(this.page());
    }
  }

  moveToFirstPage() {
    this.moveToPage(1);
  }

  moveToLastPage() {
    this.moveToPage(this.entityMeta()?.totalPages ?? 1);
  }
}
