import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CRUDService } from 'src/app/services/CRUD/crud.service';
import { GameType } from 'src/common/interfaces.js';
import { GameTypeModalComponent } from '../game-type-modal/game-type-modal.component';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-game-type-table',
  templateUrl: './game-type-table.component.html',
  styleUrls: ['./game-type-table.component.css'],
})
export class GameTypeTableComponent {
  gameTypes: GameType[] = [];
  canEdit: boolean = false;

  dataSource: any;

  tableHeaders: string[] = ['id', 'name', 'description', 'tags', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private crudService: CRUDService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getGameTypes();
    if (this.router.url.includes('admin')) {
      this.canEdit = true;
    }
  }

  getGameTypes(): void {
    this.crudService.getGameTypes().subscribe((response: any) => {
      this.gameTypes = response.data;
      this.dataSource = new MatTableDataSource<GameType>(this.gameTypes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  filterChanges(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue;
  }

  add() {
    let gameTypeSelected: GameType = {
      id: 0,
      name: '',
      description: '',
      tags: [],
    };

    const dialogRef = this.dialog.open(GameTypeModalComponent, {
      data: { gameType: gameTypeSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: GameType) => {
      if (result) {
        gameTypeSelected = result;
        console.log(gameTypeSelected);
        this.SaveGameType(gameTypeSelected);
      }
    });
  }

  delete(row: GameType) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { element: row, typeConfirm: 'borrar' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.crudService.deleteGameType(row.id).subscribe((response: any) => {
          this.getGameTypes();
        });
      }
    });
  }

  edit(row: GameType) {
    let gameTypeSelected: GameType = row;

    const dialogRef = this.dialog.open(GameTypeModalComponent, {
      data: { gameType: gameTypeSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        gameTypeSelected = result;
        console.log(gameTypeSelected);
        this.SaveGameType(gameTypeSelected);
      }
    });
  }

  SaveGameType(gameType: GameType) {
    if (gameType.id === 0) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: gameType, typeConfirm: 'crear' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.crudService
            .createGameType(gameType)
            .subscribe((response: any) => {
              this.getGameTypes();
            });
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: gameType, typeConfirm: 'crear' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.crudService
            .updateGameType(gameType)
            .subscribe((response: any) => {
              this.getGameTypes();
            });
        }
      });
    }
  }
}
