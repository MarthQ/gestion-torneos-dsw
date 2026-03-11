import { Component, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ToasterService } from '@services/toaster.service';
import { map, tap } from 'rxjs';

import { UserService } from '@services/user.service';
import { Pagination } from '@shared/components/pagination/pagination';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { User } from '@shared/interfaces/user';
import { UserCrudModal } from './user-crud-modal/user-crud-modal';
import { LocationService } from '@services/location.service';
import { RoleService } from '@services/role.service';
import { QueryFilter } from '@shared/interfaces/filters';

@Component({
  selector: 'app-user-crud',
  imports: [Pagination, SearchBar, UserCrudModal],
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

  handleCrudAction(user: User) {
    switch (this.modalType()) {
      case 'add':
        this.userService.addUser(user).subscribe({
          next: () => {
            ToasterService.success('El usuario se agregó correctamente');
            this.userResource.reload();
          },
          error: (err) => {
            ToasterService.error('Ocurrió un error, la acción no se realizó', err);
            console.error(err);
          },
        });
        break;
      case 'edit':
        this.userService.updateUser(user).subscribe({
          next: () => {
            ToasterService.success('El usuario se modificó correctamente');
            this.userResource.reload();
          },
          error: (err) => {
            ToasterService.error('Ocurrió un error, la acción no se realizó', err);
            console.error(err);
          },
        });
        break;
      case 'delete':
        this.userService.deleteUser(user).subscribe({
          next: () => {
            ToasterService.success('El usuario se eliminó correctamente');
            this.userResource.reload();
          },
          error: (err) => {
            ToasterService.error('Ocurrió un error, la acción no se realizó', err);
            console.error(err);
          },
        });
    }
  }
}
