import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CrudAction } from '@shared/interfaces/crudAction';
import { Region } from '@shared/interfaces/region';
import { RegionService } from '@shared/services/region.service';
import { Toaster } from '@shared/utils/toaster';
import { map, tap } from 'rxjs';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { Pagination } from '@shared/components/pagination/pagination';
import { RegionCrudModal } from './region-crud-modal/region-crud-modal';
import { PaginationMeta } from '@shared/interfaces/api-response';
import { Limit } from '@shared/components/limit/limit';
import { LimitService } from '@shared/components/limit/limit.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Router } from '@angular/router';

@Component({
  imports: [RegionCrudModal, SearchBar, Pagination, Limit],
  templateUrl: './region-crud.html',
})
export class RegionCrud {
  limitService = inject(LimitService);
  paginationService = inject(PaginationService);
  router = inject(Router);
  regionService = inject(RegionService);

  pageRecalculation = effect(() => {
    if (!this.regionResource.value()) return;
    if (!this.regionMeta()) return;
    const maxPage = Math.ceil(this.regionMeta()!.total / this.limitService.currentLimit());
    const currentPage = this.paginationService.currentPage();

    if (currentPage > maxPage && maxPage > 0) {
      this.router.navigate([], {
        queryParams: { page: maxPage },
        queryParamsHandling: 'merge',
      });
    }
  });

  // API Get parameters (for table)
  query = signal<string>('');

  // Modal parameters
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  selectedRegion = signal<Partial<Region>>({});

  regionMeta = signal<PaginationMeta | undefined>(undefined);

  regionResource = rxResource({
    params: () => ({
      query: this.query(),
      page: this.paginationService.currentPage(),
      limit: this.limitService.currentLimit(),
    }),
    stream: ({ params }) => {
      return this.regionService.getRegionsPaginated(params.query, params.page, params.limit).pipe(
        tap((response) => this.regionMeta.set(response.meta)),
        map((response) => response.data),
      );
    },
  });

  addRegion() {
    this.modalType.set('add');
    this.selectedRegion.set({});
    this.openModal.set(true);
  }
  editRegion(region: Region) {
    this.modalType.set('edit');
    this.selectedRegion.set(region);
    this.openModal.set(true);
  }
  deleteRegion(region: Region) {
    this.modalType.set('delete');
    this.selectedRegion.set(region);
    this.openModal.set(true);
  }

  handleCrudAction(event: CrudAction<Region>) {
    switch (event.actionType) {
      case 'create':
        this.regionService.addRegion(event.data).subscribe({
          next: () => {
            Toaster.success('La región se agregó correctamente');
            this.regionResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
        break;
      case 'update':
        this.regionService.updateRegion(event.data).subscribe({
          next: () => {
            Toaster.success('La región se modificó correctamente');
            this.regionResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
        break;
      case 'delete':
        this.regionService.deleteRegion(event.data).subscribe({
          next: () => {
            Toaster.success('La región se eliminó correctamente');
            this.regionResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
    }
  }
}
