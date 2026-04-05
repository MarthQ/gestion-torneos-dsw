import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
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
import { DataTable } from '@shared/components/data-table/data-table';
import { TableColumn } from '@shared/interfaces/table-column';
import { TableAction } from '@shared/interfaces/table-action';
import { TableState } from '@shared/interfaces/table-state';

@Component({
  imports: [RegionCrudModal, SearchBar, Pagination, DataTable],
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

  // Table configuration
  regionColumns: TableColumn<Region>[] = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'name', label: 'Nombre de la Región' },
  ];

  regionActions: TableAction<Region>[] = [
    {
      icon: 'boxicons--edit-filled',
      label: 'Editar región',
      action: 'edit',
      color: 'warning',
    },
    {
      icon: 'boxicons--trash',
      label: 'Eliminar región',
      action: 'delete',
      color: 'error',
    },
  ];

  tableState = computed<TableState>(() => {
    if (this.regionResource.isLoading()) return 'loading';
    if (this.regionResource.hasValue() && this.regionResource.value().length === 0) return 'empty';
    return 'hasData';
  });

  pageChangedTo(newPage: number) {
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

  handleRowAction(event: { action: 'edit' | 'delete'; row: Region }) {
    if (event.action === 'edit') {
      this.editRegion(event.row);
    } else {
      this.deleteRegion(event.row);
    }
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
        break;
    }
  }
}
