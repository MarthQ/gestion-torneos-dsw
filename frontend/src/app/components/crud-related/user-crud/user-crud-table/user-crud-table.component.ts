import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Location, User } from 'src/common/interfaces.js';
import { UserCrudModalComponent } from '../user-crud-modal/user-crud-modal.component';
import { UserCrudService } from 'src/app/services/CRUD/user-crud.service';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-crud-table',
  templateUrl: './user-crud-table.component.html',
  styleUrls: ['./user-crud-table.component.css'],
})
export class UserCrudTableComponent {
  users: User[] = [];
  canEdit: boolean = false;

  dataSource: any;

  tableHeaders: string[] = [
    'id',
    'name',
    'password',
    'mail',
    'location',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userCrudService: UserCrudService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getUsers();
    if (this.router.url.includes('admin')) {
      this.canEdit = true;
    }
  }

  getUsers(): void {
    this.userCrudService.getUsers().subscribe((response: User[]) => {
      this.users = response;
      this.dataSource = new MatTableDataSource<User>(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  formatLocation(location: Location): string {
    return location.name;
  }

  filterChanges(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue;
  }

  add() {
    let userSelected: User = {
      id: 0,
      name: '',
      password: '',
      mail: '',
      location: [],
    };

    const dialogRef = this.dialog.open(UserCrudModalComponent, {
      data: { user: userSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        userSelected = result;
        this.saveUser(userSelected);
      }
    });
  }

  delete(row: User) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { element: row, typeConfirm: 'borrar' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userCrudService.deleteUser(row.id).subscribe((response: any) => {
          this.getUsers();
        });
      }
    });
  }

  edit(row: User) {
    let userSelected: User = row;

    const dialogRef = this.dialog.open(UserCrudModalComponent, {
      data: { user: userSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        userSelected = result;
        console.log(userSelected);
        this.saveUser(userSelected);
      }
    });
  }

  saveUser(user: User) {
    if (user.id === 0) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: user, typeConfirm: 'crear' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.userCrudService.createUser(user).subscribe((response: any) => {
            this.getUsers();
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: user, typeConfirm: 'modificar' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.userCrudService.updateUser(user).subscribe((response: any) => {
            this.getUsers();
          });
        }
      });
    }
  }
}
