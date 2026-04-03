import { I18nSelectPipe } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  ResourceRef,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
import { CrudAction } from '@shared/interfaces/crudAction';
import { Location } from '@shared/interfaces/location';
import { Role } from '@shared/interfaces/role';
import { User, UserFormDTO } from '@shared/interfaces/user';
import { FormUtils } from '@shared/utils/form-utils';

@Component({
  selector: 'user-crud-modal',
  imports: [I18nSelectPipe, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './user-crud-modal.html',
})
export class UserCrudModal {
  user = input.required<Partial<User>>();
  type = input.required<'add' | 'edit' | 'delete'>();
  open = input.required<boolean>();
  closed = output<void>();
  confirmAction = output<CrudAction<UserFormDTO>>();

  locationResource = input.required<ResourceRef<Location[] | undefined>>();
  roleResource = input.required<ResourceRef<Role[] | undefined>>();

  userModal = viewChild.required<ElementRef<HTMLDialogElement>>('userModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega un usuario',
    edit: 'Modifica un usuario.',
    delete: 'Borrar un usuario',
  };

  userForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    mail: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    location: [0, [Validators.required, Validators.min(1)]],
    role: [0, [Validators.required, Validators.min(1)]],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.userModal().nativeElement.showModal();
      this.userForm.patchValue({
        name: this.user().name ?? '',
        mail: this.user().mail ?? '',
        location: this.user().location?.id ?? 0,
        role: this.user().role?.id ?? 0,
      });
    } else {
      this.userModal().nativeElement.close();
    }
  });

  onDialogClose() {
    this.closed.emit();
  }
  emitUser() {
    if (this.userForm.valid) {
      const { name, mail, location, role } = this.userForm.getRawValue();
      const id = this.user()?.id;
      switch (this.type()) {
        case 'add':
          this.confirmAction.emit({
            actionType: 'create',
            data: { name, mail, location, role },
          });
          break;
        case 'edit':
          this.confirmAction.emit({
            actionType: 'update',
            data: { id: id!, name, mail, location, role },
          });
          break;
        case 'delete':
          this.confirmAction.emit({ actionType: 'delete', data: { id: id! } });
      }
    }
  }
}
