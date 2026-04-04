import { DataTable } from '@shared/components/data-table/data-table';
import { TableColumn } from '@shared/interfaces/table-column';
import { TableAction } from '@shared/interfaces/table-action';
import { TableState } from '@shared/interfaces/table-state';
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
import { map, tap } from 'rxjs';

import { Toaster } from '@shared/utils/toaster';
import { Location } from '@shared/interfaces/location';
import { LocationService } from '@shared/services/location.service';
import { LocationCrudModal } from './location-crud-modal/location-crud-modal';
import { Pagination } from '@shared/components/pagination/pagination';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { CrudAction } from '@shared/interfaces/crudAction';
import { PaginationMeta } from '@shared/interfaces/api-response';

@Component({
  imports: [LocationCrudModal, Pagination, SearchBar, DataTable],
  templateUrl: './location-crud.html',
})
export class LocationCrud {
  locationService = inject(LocationService);

  // Table configuration
  locationColumns: TableColumn<Location>[] = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'name', label: 'Nombre de la Localidad' },
  ];

  locationActions: TableAction<Location>[] = [
    {
      icon: 'boxicons--edit-filled',
      label: 'Editar localidad',
      action: 'edit',
      color: 'warning',
    },
    {
      icon: 'boxicons--trash',
      label: 'Eliminar localidad',
      action: 'delete',
      color: 'error',
    },
  ];

  tableState = computed<TableState>(() => {
    if (this.locationResource.isLoading()) return 'loading';
    if (this.locationResource.hasValue() && this.locationResource.value().length === 0)
      return 'empty';
    return 'hasData';
  });

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

  selectedLocation = signal<Partial<Location>>({});

  locationMeta = signal<PaginationMeta | undefined>(undefined);

  locationResource = rxResource({
    params: () => ({ query: this.query(), page: this.page() }),
    stream: ({ params }) => {
      return this.locationService
        .getLocationsPaginated(params.query, params.page, this.pageSize)
        .pipe(
          tap((response) => this.locationMeta.set(response.meta)),
          map((response) => response.data),
        );
    },
  });

  pageChangedTo(newPage: number) {
    console.log(this.query());
    this.page.set(newPage);
  }

  addLocation() {
    this.modalType.set('add');
    this.selectedLocation.set({});
    this.openModal.set(true);
  }
  editLocation(location: Location) {
    this.modalType.set('edit');
    this.selectedLocation.set(location);
    this.openModal.set(true);
  }
  deleteLocation(location: Location) {
    this.modalType.set('delete');
    this.selectedLocation.set(location);
    this.openModal.set(true);
  }

  handleCrudAction(event: CrudAction<Location>) {
    switch (event.actionType) {
      case 'create':
        this.locationService.addLocation(event.data).subscribe({
          next: () => {
            Toaster.success('La localidad se agregó correctamente');
            this.locationResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
        break;
      case 'update':
        this.locationService.updateLocation(event.data).subscribe({
          next: () => {
            Toaster.success('La localidad se modificó correctamente');
            this.locationResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
        break;
      case 'delete':
        this.locationService.deleteLocation(event.data).subscribe({
          next: () => {
            Toaster.success('La localidad se eliminó correctamente');
            this.locationResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
    }
  }

  handleRowAction(event: { action: 'edit' | 'delete'; row: Location }) {
    if (event.action === 'edit') {
      this.editLocation(event.row);
    } else {
      this.deleteLocation(event.row);
    }
  }
}
