import { I18nSelectPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';

import { Location } from '@shared/interfaces/location';

@Component({
  selector: 'location-crud-modal',
  imports: [I18nSelectPipe, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './location-crud-modal.html',
})
export class LocationCrudModal {
  location = input.required<Partial<Location>>();
  type = input.required<'add' | 'edit' | 'delete'>();
  open = input.required<boolean>();
  closed = output<void>();
  confirmAction = output<Location>();

  locationModal = viewChild.required<ElementRef<HTMLDialogElement>>('locationModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega una localidad',
    edit: 'Modifica una localidad.',
    delete: 'Borrar una localidad',
  };

  locationForm = this.fb.nonNullable.group({
    id: [0, Validators.required],
    name: ['', Validators.required],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.locationModal().nativeElement.showModal();
      this.locationForm.patchValue({
        id: this.location().id ?? 0,
        name: this.location().name ?? '',
      });
    } else {
      this.locationModal().nativeElement.close();
    }
  });

  onDialogClose() {
    this.closed.emit();
  }
  emitLocation() {
    if (this.locationForm.valid) {
      const location = this.locationForm.getRawValue();
      this.confirmAction.emit(location);
    }
  }
}
