import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LocationService } from 'src/app/services/location.service';
import { LocationCrudModal } from './location-crud-modal/location-crud-modal';
import { Location } from '@shared/interfaces/location';

@Component({
  selector: 'app-location-crud',
  imports: [LocationCrudModal],
  templateUrl: './location-crud.html',
})
export class LocationCrud {
  query = signal('');
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  locationService = inject(LocationService);

  selectedLocation = signal<Partial<Location>>({});

  locationResource = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) => {
      return this.locationService.getAllLocations();
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
