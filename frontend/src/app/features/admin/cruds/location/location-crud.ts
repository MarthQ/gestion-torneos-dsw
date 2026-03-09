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
import { LocationService } from 'src/app/services/location.service';
import { LocationCrudModal } from './location-crud-modal/location-crud-modal';
import { Location } from '@shared/interfaces/location';
import { map, tap } from 'rxjs';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-location-crud',
  imports: [LocationCrudModal],
  templateUrl: './location-crud.html',
})
export class LocationCrud {
  locationService = inject(LocationService);

  // ElementRef for resetting the query
  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  // API Get parameters (for table)
  query = signal('');
  page = linkedSignal({
    source: this.query,
    computation: () => 1,
  });
  pageSize = 10;

  totalPages = computed(() =>
    Array.from({ length: this.locationMeta()?.totalPages ?? 0 }, (_, i) => i + 1),
  );

  // Modal parameters
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  selectedLocation = signal<Partial<Location>>({});

  locationMeta = signal<ApiResponse<Location[]>['meta']>(undefined);

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

  clearQuery() {
    this.query.set('');
    this.searchInput().nativeElement.value = '';
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
          next: () => this.locationResource.reload(),
          error: (err) => console.error(err),
        });
        break;
      case 'edit':
        this.locationService.updateLocation(location).subscribe({
          next: () => this.locationResource.reload(),
          error: (err) => console.error(err),
        });
        break;
      case 'delete':
        this.locationService.deleteLocation(location).subscribe({
          next: () => this.locationResource.reload(),
          error: (err) => console.error(err),
        });
    }
  }
}
