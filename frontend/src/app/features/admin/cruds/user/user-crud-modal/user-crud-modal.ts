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
import { Location } from '@shared/interfaces/location';
import { Role } from '@shared/interfaces/role';
import { User } from '@shared/interfaces/user';
import { FormUtils } from '@shared/utils/form-utils';

@Component({
  selector: 'user-crud-modal',
  imports: [I18nSelectPipe, ReactiveFormsModule],
  templateUrl: './user-crud-modal.html',
})
export class UserCrudModal {
  user = input.required<Partial<User>>();
  type = input.required<'add' | 'edit' | 'delete'>();
  open = input.required<boolean>();
  closed = output<void>();
  confirmAction = output<any>();

  locationResource = input.required<ResourceRef<Location[] | undefined>>();
  roleResource = input.required<ResourceRef<Role[] | undefined>>();

  userModal = viewChild.required<ElementRef<HTMLDialogElement>>('userModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega una localidad',
    edit: 'Modifica una localidad.',
    delete: 'Borrar una localidad',
  };

  userForm = this.fb.group({
    id: [0, Validators.required],
    name: ['', Validators.required],
    mail: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    location: [0, Validators.required],
    role: [0, Validators.required],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.userModal().nativeElement.showModal();
      this.userForm.patchValue({
        id: this.user().id ?? 0,
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
    console.log(this.userForm.getRawValue());
    console.log(this.userForm.errors);
  }
  emitUser() {
    if (this.userForm.valid) {
      const user = this.userForm.getRawValue();
      this.confirmAction.emit(user);
    }
  }
}
