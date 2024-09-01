import { Component } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CRUDService } from 'src/app/services/CRUD/crud.service';
import { GameType } from 'src/common/interfaces.js';
import { GameTypeModalComponent } from '../game-type-modal/game-type-modal.component';

@Component({
  selector: 'app-game-type-table',
  templateUrl: './game-type-table.component.html',
  styleUrls: ['./game-type-table.component.css'],
})
export class GameTypeTableComponent {
  constructor(
    private crudService: CRUDService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  gameTypes: GameType[] = [];
  canEdit: boolean = false;

  gameTypeKeys: (keyof GameType)[] = [
    'id' as keyof GameType,
    'name' as keyof GameType,
    'description' as keyof GameType,
    'tags' as keyof GameType,
  ];

  ngOnInit() {
    this.getGameTypes();
    if (this.router.url.includes('admin')) {
      this.canEdit = true;
    }
  }

  getGameTypes(): void {
    this.crudService
      .getGameTypes()
      .subscribe((response: any) => (this.gameTypes = response.data));
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
    if (
      window.confirm(
        'Estas a punto de borrar el siguiente tipo de juego: \n' +
          'Id: ' +
          row.id +
          '\n' +
          'Nombre: ' +
          row.name
      )
    ) {
      this.crudService.deleteGameType(row.id).subscribe((response: any) => {
        this.getGameTypes();
      });
    }
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
      if (
        window.confirm(
          'Estas a punto de crear el siguiente tipo de juego: \n' +
            'Nombre: ' +
            gameType.name
        )
      ) {
        this.crudService.createGameType(gameType).subscribe((response: any) => {
          this.getGameTypes();
        });
      }
    } else {
      if (
        window.confirm(
          'Estas a punto de modificar el siguiente tipo de juego: \n' +
            'Id: ' +
            gameType.id +
            '\n' +
            'Nombre: ' +
            gameType.name
        )
      )
        this.crudService.updateGameType(gameType).subscribe((response: any) => {
          this.getGameTypes();
        });
    }
  }
}
