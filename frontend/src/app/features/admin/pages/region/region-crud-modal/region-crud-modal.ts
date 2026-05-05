import { I18nSelectPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
import { CrudAction } from '@shared/interfaces/crudAction';
import { Region } from '@shared/interfaces/region';

@Component({
  selector: 'region-crud-modal',
  imports: [I18nSelectPipe, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './region-crud-modal.html',
})
export class RegionCrudModal {
  region = input.required<Partial<Region>>();
  type = input.required<'add' | 'edit' | 'delete'>();
  open = input.required<boolean>();
  closed = output<void>();
  confirmAction = output<CrudAction<Region>>();

  regionModal = viewChild.required<ElementRef<HTMLDialogElement>>('regionModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega una región',
    edit: 'Modifica una región.',
    delete: 'Borrar una región',
  };

  regionForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.regionModal().nativeElement.showModal();
      this.regionForm.patchValue({
        name: this.region().name ?? '',
      });
    } else {
      this.regionModal().nativeElement.close();
    }
  });

  onDialogClose() {
    this.closed.emit();
  }

  emitRegion() {
    if (this.regionForm.valid) {
      const { name } = this.regionForm.getRawValue();
      const id = this.region()?.id;

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
