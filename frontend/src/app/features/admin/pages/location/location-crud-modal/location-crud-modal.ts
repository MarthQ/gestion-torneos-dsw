import { I18nSelectPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
import { CrudAction } from '@shared/interfaces/crudAction';

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
  confirmAction = output<CrudAction<Location>>();

  locationModal = viewChild.required<ElementRef<HTMLDialogElement>>('locationModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega una localidad',
    edit: 'Modifica una localidad.',
    delete: 'Borrar una localidad',
  };

  locationForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.locationModal().nativeElement.showModal();
      this.locationForm.patchValue({
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
      const { name } = this.locationForm.getRawValue();
      const id = this.location()?.id;

      switch (this.type()) {
        case 'add':
          this.confirmAction.emit({ actionType: 'create', data: { name } });
          break;
        case 'edit':
          this.confirmAction.emit({ actionType: 'update', data: { id: id!, name } });
          break;
        case 'delete':
          this.confirmAction.emit({ actionType: 'delete', data: { id: id! } });
      }
    }
  }
}
