import { Component, ViewChild } from '@angular/core';
import { Game } from 'src/common/interfaces'
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/CRUD/game.service';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GameModalComponent } from '../game-modal/game-modal/game-modal.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent {
  game: Game[] = [];
  canEdit: boolean = false;
  dataSource: any;
  tableHeaders: string[] = ['id', 'name', 'cant_torneos', 'gametype', 'tags', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private gameService: GameService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getGames();
    if (this.router.url.includes('admin')) {
      this.canEdit = true;
    }
  }

  getGames(): void {
    this.gameService.getGames().subscribe((response: any) => {
      this.game = response.data;
      this.dataSource = new MatTableDataSource<Game>(this.game);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  filterChanges(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue;
  }

  add() {
    let gameSelected: Game = {
      id: 0,
      name: '',
      cant_torneos: 0,
      gametype: null,
      tags: [],
    };

    const dialogRef = this.dialog.open(GameModalComponent, {
      data: { game: gameSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: Game) => {
      if (result) {
        gameSelected = result;
        console.log(gameSelected);
        this.SaveGame(gameSelected);
      }
    });
  }

  delete(row: Game) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { element: row, typeConfirm: 'borrar' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.gameService.deleteGame(row.id).subscribe((response: any) => {
          this.getGames();
        });
      }
    });
  }

  edit(row: Game) {
    let gameSelected: Game = row;

    const dialogRef = this.dialog.open(GameModalComponent, {
      data: { game: gameSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        gameSelected = result;
        console.log(gameSelected);
        this.SaveGame(gameSelected);
      }
    });
  }

  SaveGame(game: Game) {
    if (game.id === 0) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: game, typeConfirm: 'crear' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.gameService
            .createGame(game)
            .subscribe((response: any) => {
              this.getGames();
            });
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: game, typeConfirm: 'crear' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.gameService
            .updateGame(game)
            .subscribe((response: any) => {
              this.getGames();
            });
        }
      });
    }
  }
}
