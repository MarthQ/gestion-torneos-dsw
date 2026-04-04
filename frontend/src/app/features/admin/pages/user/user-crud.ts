import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Toaster } from '@shared/utils/toaster';
import { map, tap } from 'rxjs';

import { UserService } from '@shared/services/user.service';
import { Pagination } from '@shared/components/pagination/pagination';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { DataTable } from '@shared/components/data-table/data-table';
import { TableColumn } from '@shared/interfaces/table-column';
import { TableAction } from '@shared/interfaces/table-action';
import { TableState } from '@shared/interfaces/table-state';
import { User, UserFormDTO } from '@shared/interfaces/user';
import { UserCrudModal } from './user-crud-modal/user-crud-modal';
import { LocationService } from '@shared/services/location.service';
import { RoleService } from '@features/admin/services/role.service';
import { QueryFilter } from '@shared/interfaces/filters';
import { CrudAction } from '@shared/interfaces/crudAction';
import { PaginationMeta } from '@shared/interfaces/api-response';

@Component({
  imports: [Pagination, SearchBar, UserCrudModal, DataTable],
  templateUrl: './user-crud.html',
})
export class UserCrud {
  userService = inject(UserService);

  locationService = inject(LocationService);
  roleService = inject(RoleService);

  // API Get parameters (for table)
  query = signal('');
  queryFilters = signal<QueryFilter>({});
  page = linkedSignal({
    source: this.query,
    computation: () => 1,
  });
  pageSize = 10;

  // Modal parameters
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  selectedUser = signal<Partial<User>>({});

  userMeta = signal<PaginationMeta | undefined>(undefined);

  locationResource = rxResource({
    stream: () => this.locationService.getLocations(),
  });
  roleResource = rxResource({
    stream: () => this.roleService.getRoles(),
  });

  userResource = rxResource({
    params: () => ({ query: this.query(), queryFilters: this.queryFilters(), page: this.page() }),
    stream: ({ params }) => {
      return this.userService
        .getUsersPaginated(params.query, params.queryFilters, params.page, this.pageSize)
        .pipe(
          tap((response) => this.userMeta.set(response.meta)),
          map((response) => response.data),
        );
    },
  });

  // Visual actions (pagination)
  pageChangedTo(newPage: number) {
    this.page.set(newPage);
  }

  // CRUD Actions
  addUser() {
    this.modalType.set('add');
    this.selectedUser.set({});
    this.openModal.set(true);
  }
  editUser(user: User) {
    this.modalType.set('edit');
    this.selectedUser.set(user);
    this.openModal.set(true);
  }
  deleteUser(user: User) {
    this.modalType.set('delete');
    this.selectedUser.set(user);
    this.openModal.set(true);
  }

  handleCrudAction(event: CrudAction<UserFormDTO>) {
    switch (event.actionType) {
      case 'create':
        this.userService.addUser(event.data).subscribe({
          next: () => {
            Toaster.success('El usuario se agregó correctamente');
            this.userResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
        break;
      case 'update':
        this.userService.updateUser(event.data).subscribe({
          next: () => {
            Toaster.success('El usuario se modificó correctamente');
            this.userResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
        break;
      case 'delete':
        this.userService.deleteUser(event.data).subscribe({
          next: () => {
            Toaster.success('El usuario se eliminó correctamente');
            this.userResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
    }
  }

  sendInvitation(user: User) {
    const path = '/auth/setup-password';
    this.userService.sendInvitation(user.id, path).subscribe({
      next: () => {
        Toaster.success(`Email enviado correctamente a ${user.mail}`);
      },
      error: (message) => {
        Toaster.error(message);
        console.log(message);
      },
    });
  }

  // Data Table Configuration
  userColumns: TableColumn<User>[] = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'name', label: 'Nombre', width: '180px' },
    { key: 'mail', label: 'Correo Electrónico', width: '220px' },
    {
      key: 'location.name',
      label: 'Localidad',
      width: '150px',
      badge: {
        values: {},
      },
    },
    {
      key: 'role.name',
      label: 'Rol',
      width: '120px',
      badge: {
        values: {},
      },
    },
  ];

  userActions: TableAction<User>[] = [
    {
      icon: 'material-symbols--mail',
      label: 'Enviar invitación',
      action: 'edit',
      condition: (user) => !user.hasPassword,
      color: 'info',
    },
    {
      icon: 'boxicons--edit-filled',
      label: 'Editar usuario',
      action: 'edit',
      color: 'warning',
    },
    {
      icon: 'boxicons--trash',
      label: 'Eliminar usuario',
      action: 'delete',
      color: 'error',
    },
  ];

  tableState = computed<TableState>(() => {
    if (this.userResource.isLoading()) return 'loading';
    if (this.userResource.hasValue() && this.userResource.value().length === 0) return 'empty';
    return 'hasData';
  });

  handleRowAction(event: { action: 'edit' | 'delete'; row: User }) {
    if (event.action === 'edit') {
      if (!event.row.hasPassword) {
        this.sendInvitation(event.row);
      } else {
        this.editUser(event.row);
      }
    } else {
      this.deleteUser(event.row);
    }
  }
}
