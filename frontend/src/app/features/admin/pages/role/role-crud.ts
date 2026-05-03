import { Component, effect, inject, signal } from '@angular/core';
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
import { PaginationMeta } from '@shared/interfaces/api-response';
import { Limit } from '@shared/components/limit/limit';
import { LimitService } from '@shared/components/limit/limit.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Router } from '@angular/router';

@Component({
  imports: [RoleCrudModal, Pagination, SearchBar, Limit],
  templateUrl: './role-crud.html',
})
export class RoleCrud {
  limitService = inject(LimitService);
  paginationService = inject(PaginationService);
  router = inject(Router);
  roleService = inject(RoleService);

  pageRecalculation = effect(() => {
    if (!this.roleResource.value()) return;
    if (!this.roleMeta()) return;
    const maxPage = Math.ceil(this.roleMeta()!.total / this.limitService.currentLimit());
    const currentPage = this.paginationService.currentPage();

    if (currentPage > maxPage && maxPage > 0) {
      this.router.navigate([], {
        queryParams: { page: maxPage },
        queryParamsHandling: 'merge',
      });
    }
  });

  // API Get parameters (for table)
  query = signal('');

  // Modal parameters
  modalType = signal<'add' | 'edit' | 'delete'>('add');
  openModal = signal<boolean>(false);

  selectedRole = signal<Partial<Role>>({});

  roleMeta = signal<PaginationMeta | undefined>(undefined);

  roleResource = rxResource({
    params: () => ({
      query: this.query(),
      page: this.paginationService.currentPage(),
      limit: this.limitService.currentLimit(),
    }),
    stream: ({ params }) => {
      return this.roleService.getRolesPaginated(params.query, params.page, params.limit).pipe(
        tap((response) => this.roleMeta.set(response.meta)),
        tap((response) => console.log(response)),
        map((response) => response.data),
      );
    },
  });

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
