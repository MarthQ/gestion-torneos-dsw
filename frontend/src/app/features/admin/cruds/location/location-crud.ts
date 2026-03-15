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

import { ToasterService } from 'src/app/services/toaster.service';
import { Location } from '@shared/interfaces/location';
import { LocationService } from 'src/app/services/location.service';
import { LocationCrudModal } from './location-crud-modal/location-crud-modal';
import { Pagination } from '@shared/components/pagination/pagination';
import { SearchBar } from '@shared/components/search-bar/search-bar';

@Component({
  selector: 'admin-location-crud',
  imports: [LocationCrudModal, Pagination, SearchBar],
  templateUrl: './location-crud.html',
})
export class LocationCrud {
  locationService = inject(LocationService);

  // API Get parameters (for table)
  query = signal<string>('');
  page = linkedSignal({
    source: this.query,
    computation: () => 1,
  });
  pageSize = 1;

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
  handleCrudAction(location: Location) {
    switch (this.modalType()) {
      case 'add':
        this.locationService.addLocation(location).subscribe({
          next: () => {
            ToasterService.success('La localidad se agregó correctamente');
            this.locationResource.reload();
          },
          error: (err) => {
            ToasterService.error('Ocurrió un error, la acción no se realizó', err);
            console.error(err);
          },
        });
        break;
      case 'edit':
        this.locationService.updateLocation(location).subscribe({
          next: () => {
            ToasterService.success('La localidad se modificó correctamente');
            this.locationResource.reload();
          },
          error: (err) => {
            ToasterService.error('Ocurrió un error, la acción no se realizó', err);
            console.error(err);
          },
        });
        break;
      case 'delete':
        this.locationService.deleteLocation(location).subscribe({
          next: () => {
            ToasterService.success('La localidad se eliminó correctamente');
            this.locationResource.reload();
          },
          error: (err) => {
            ToasterService.error('Ocurrió un error, la acción no se realizó', err);
            console.error(err);
          },
        });
    }
  }
}
