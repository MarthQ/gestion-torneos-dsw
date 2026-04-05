import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Role } from '@shared/interfaces/role';
import { map, tap } from 'rxjs';
import { RoleService } from '@features/admin/services/role.service';
import { Toaster } from '@shared/utils/toaster';
import { Tag } from '@shared/interfaces/tag';
import { Pagination } from '@shared/components/pagination/pagination';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { RoleCrudModal } from './role-crud-modal/role-crud-modal';
import { CrudAction } from '@shared/interfaces/crudAction';
import { DataTable } from '@shared/components/data-table/data-table';
import { TableColumn } from '@shared/interfaces/table-column';
import { TableAction } from '@shared/interfaces/table-action';
import { TableState } from '@shared/interfaces/table-state';
import { PaginationMeta } from '@shared/interfaces/api-response';

@Component({
  imports: [RoleCrudModal, Pagination, SearchBar, DataTable],
  templateUrl: './role-crud.html',
})
export class RoleCrud {
  roleService = inject(RoleService);

  // API Get parameters (for table)
  query = signal('');
  page = linkedSignal({
    source: this.query,
    computation: () => 1,
  });
  pageSize = 10;

  roleColumns: TableColumn<Role>[] = [
    { key: 'id', label: 'ID', width: '80px' },
    { 
      key: 'name', 
      label: 'Nombre del Rol',
      badge: {
        values: {
          'Admin': { class: 'badge-lg badge-primary', icon: 'eos-icons--role-binding' },
          'User': { class: 'badge-lg badge-secondary', icon: 'eos-icons--role-binding' },
        }
      }
    },
  ];

  roleActions: TableAction<Role>[] = [
    {
      icon: 'boxicons--edit-filled',
      label: 'Editar rol',
      action: 'edit',
      color: 'warning',
    },
    {
      icon: 'boxicons--trash',
      label: 'Eliminar rol',
      action: 'delete',
      color: 'error',
    },
  ];

  tableState = computed<TableState>(() => {
    if (this.roleResource.isLoading()) return 'loading';
    if (this.roleResource.hasValue() && this.roleResource.value().length === 0) return 'empty';
    return 'hasData';
  });

  // Modal parameters
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  selectedRole = signal<Partial<Role>>({});

  roleMeta = signal<PaginationMeta | undefined>(undefined);

  roleResource = rxResource({
    params: () => ({ query: this.query(), page: this.page() }),
    stream: ({ params }) => {
      return this.roleService.getRolesPaginated(params.query, params.page, this.pageSize).pipe(
        tap((response) => this.roleMeta.set(response.meta)),
        tap((response) => console.log(response)),
        map((response) => response.data),
      );
    },
  });
  pageChangedTo(newPage: number) {
    this.page.set(newPage);
  }

  addRole() {
    this.modalType.set('add');
    this.selectedRole.set({});
    this.openModal.set(true);
  }
  editRole(role: Role) {
    this.modalType.set('edit');
    this.selectedRole.set(role);
    this.openModal.set(true);
  }
  deleteRole(role: Role) {
    this.modalType.set('delete');
    this.selectedRole.set(role);
    this.openModal.set(true);
  }
  handleRowAction(event: { action: 'edit' | 'delete'; row: Role }) {
    if (event.action === 'edit') {
      this.editRole(event.row);
    } else {
      this.deleteRole(event.row);
    }
  }
  handleCrudAction(event: CrudAction<Role>) {
    switch (event.actionType) {
      case 'create':
        this.roleService.addRole(event.data).subscribe({
          next: () => {
            Toaster.success('El rol se agregó correctamente');
            this.roleResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
        break;
      case 'update':
        this.roleService.updateRole(event.data).subscribe({
          next: () => {
            Toaster.success('El rol se modificó correctamente');
            this.roleResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
        break;
      case 'delete':
        this.roleService.deleteRole(event.data).subscribe({
          next: () => {
            Toaster.success('El rol se eliminó correctamente');
            this.roleResource.reload();
          },
          error: (message) => {
            Toaster.error(message);
            console.error(message);
          },
        });
    }
  }
}
