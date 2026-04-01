import { I18nSelectPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
import { CrudAction } from '@shared/interfaces/crudAction';
import { Role } from '@shared/interfaces/role';

@Component({
  selector: 'role-crud-modal',
  imports: [I18nSelectPipe, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './role-crud-modal.html',
})
export class RoleCrudModal {
  role = input.required<Partial<Role>>();
  type = input.required<'add' | 'edit' | 'delete'>();
  open = input.required<boolean>();
  closed = output<void>();
  confirmAction = output<CrudAction<Role>>();

  roleModal = viewChild.required<ElementRef<HTMLDialogElement>>('roleModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega una localidad',
    edit: 'Modifica un rol.',
    delete: 'Borrar un rol',
  };

  roleForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.roleModal().nativeElement.showModal();
      this.roleForm.patchValue({
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
    const { name } = this.roleForm.getRawValue();
    const id = this.role()?.id;

    switch (this.type()) {
      case 'add':
        this.confirmAction.emit({ actionType: 'create', data: { name } });
        break;
      case 'edit':
        this.confirmAction.emit({ actionType: 'update', data: { id: id!, name } });
        break;
      case 'delete':
        this.confirmAction.emit({ actionType: 'delete', data: { id: id! } });
        break;
    }
  }
}
