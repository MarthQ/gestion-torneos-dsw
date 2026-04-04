import { Component, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CrudAction } from '@shared/interfaces/crudAction';
import { Region } from '@shared/interfaces/region';
import { RegionService } from '@shared/services/region.service';
import { Toaster } from '@shared/utils/toaster';
import { map, tap } from 'rxjs';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { Pagination } from '@shared/components/pagination/pagination';
import { RegionCrudModal } from './region-crud-modal/region-crud-modal';

@Component({
  imports: [RegionCrudModal, SearchBar, Pagination],
  templateUrl: './region-crud.html',
})
export class RegionCrud {
  regionService = inject(RegionService);

  // API Get parameters (for table)
  query = signal<string>('');
  page = linkedSignal({
    source: this.query,
    computation: () => 1,
  });
  pageSize = 10;

  // Modal parameters
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  selectedRegion = signal<Partial<Region>>({});

  regionMeta = signal<PaginationMeta | undefined>(undefined);

  regionResource = rxResource({
    params: () => ({ query: this.query(), page: this.page() }),
    stream: ({ params }) => {
      return this.regionService.getRegionsPaginated(params.query, params.page, this.pageSize).pipe(
        tap((response) => this.regionMeta.set(response.meta)),
        map((response) => response.data),
      );
    },
  });

  pageChangedTo(newPage: number) {
    console.log(this.query());
    this.page.set(newPage);
  }

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
