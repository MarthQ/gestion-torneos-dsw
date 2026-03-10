import { I18nSelectPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '@shared/interfaces/role';

@Component({
  selector: 'role-crud-modal',
  imports: [I18nSelectPipe, ReactiveFormsModule],
  templateUrl: './role-crud-modal.html',
})
export class RoleCrudModal {
  role = input.required<Partial<Role>>();
  type = input.required<'add' | 'edit' | 'delete'>();
  open = input.required<boolean>();
  closed = output<void>();
  confirmAction = output<Role>();

  roleModal = viewChild.required<ElementRef<HTMLDialogElement>>('roleModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega una localidad',
    edit: 'Modifica una localidad.',
    delete: 'Borrar una localidad',
  };

  roleForm = this.fb.nonNullable.group({
    id: [0, Validators.required],
    name: ['', Validators.required],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.roleModal().nativeElement.showModal();
      this.roleForm.patchValue({
        id: this.role().id ?? 0,
        name: this.role().name ?? '',
      });
    } else {
      this.roleModal().nativeElement.close();
    }
  });

  onDialogClose() {
    this.closed.emit();
  }
  emitRole() {
    if (this.roleForm.valid) {
      const role = this.roleForm.getRawValue();
      this.confirmAction.emit(role);
    }
  }
}
