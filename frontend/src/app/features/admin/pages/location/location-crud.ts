import {
  Component,
  computed,
  effect,
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
import { LimitService } from '@shared/components/limit/limit.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Router } from '@angular/router';
import { Limit } from '@shared/components/limit/limit';

@Component({
  imports: [LocationCrudModal, Pagination, SearchBar, Limit],
  templateUrl: './location-crud.html',
})
export class LocationCrud {
  limitService = inject(LimitService);
  paginationService = inject(PaginationService);
  router = inject(Router);

  pageRecalculation = effect(() => {
    if (!this.locationResource.value()) return;
    if (!this.locationMeta()) return;
    const maxPage = Math.ceil(this.locationMeta()!.total / this.limitService.currentLimit());
    const currentPage = this.paginationService.currentPage();

    if (currentPage > maxPage && maxPage > 0) {
      this.router.navigate([], {
        queryParams: { page: maxPage },
        queryParamsHandling: 'merge',
      });
    }
  });

  locationService = inject(LocationService);

  // API Get parameters (for table)
  query = signal<string>('');

  // Modal parameters
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  selectedLocation = signal<Partial<Location>>({});

  locationMeta = signal<PaginationMeta | undefined>(undefined);

  locationResource = rxResource({
    params: () => ({
      query: this.query(),
      page: this.paginationService.currentPage(),
      limit: this.limitService.currentLimit(),
    }),
    stream: ({ params }) => {
      return this.locationService
        .getLocationsPaginated(params.query, params.page, params.limit)
        .pipe(
          tap((response) => this.locationMeta.set(response.meta)),
          map((response) => response.data),
        );
    },
  });

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
}
